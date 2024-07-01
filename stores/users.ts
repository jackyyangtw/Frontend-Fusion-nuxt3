import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    deleteUser,
} from "firebase/auth";
import { ref as dbRef, set, get, remove } from "firebase/database";
import { ref as storageRef, deleteObject } from "firebase/storage";
export const useUserStore = defineStore("user", () => {
    const { $auth, $db, $storage } = useNuxtApp();
    const config = useRuntimeConfig();
    const realTimeDbBaseUrl = config.public.firebaseRealtimeDbBaseUrl as string;

    const user = ref<User | null>(null);
    const firebaseUser = ref<FirebaseUser | null>(null);
    const setFirebaseUser = (userData: any) => {
        firebaseUser.value = userData;
    };
    const getUserData = async () => {
        if (user.value) return;
        // await $fetch(
        //     `${realTimeDbBaseUrl}/users/${firebaseUser.value?.uid}.json`,
        //     {
        //         onResponse: ({ response }) => {
        //             if (!response.ok) {
        //                 throw new Error("Failed to fetch user data");
        //             }
        //             user.value = response._data;
        //         },
        //     }
        // );
        const userRef = dbRef($db, `users/${firebaseUser.value?.uid}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            user.value = snapshot.val();
        }
    };

    const token = ref<string | null>(null);
    const setToken = (tokenData: string | null) => {
        token.value = tokenData;
    };
    const isAuthenticated = computed(() => {
        return token.value !== null;
    });

    const uiStore = useUIStore();
    const { toast } = storeToRefs(uiStore);
    const router = useRouter();
    const signinWithGoogle = async () => {
        if (isAuthenticated.value || !$auth) return;
        const provider = new GoogleAuthProvider();
        try {
            toast.value.showToast = true;
            toast.value.messageType = "loading";
            toast.value.message = "Google登入中...";
            const res = await signInWithPopup($auth, provider);
            router.push("/admin");
            toast.value.showToast = true;
            toast.value.messageType = "success";
            toast.value.message = "登入成功!";
            const user = await getCurrentUser();
            setFirebaseUser(user);
            await getUserData();
            setToken(user.accessToken);
            return res;
        } catch (e) {
            toast.value.showToast = true;
            toast.value.messageType = "error";
            toast.value.message = "登入失敗";
            return e;
        }
    };
    const signinWithEmail = async (email: string, password: string) => {
        if (isAuthenticated.value || !$auth) return;
        try {
            toast.value.showToast = true;
            toast.value.messageType = "loading";
            toast.value.message = "Email登入中...";
            const res = await signInWithEmailAndPassword(
                $auth,
                email,
                password
            );
            if (res.user) {
                const user = await getCurrentUser();
                setFirebaseUser(user);
                await getUserData();
                setToken(user.accessToken);
            }
            toast.value.showToast = true;
            toast.value.messageType = "success";
            toast.value.message = "登入成功!";
            router.push("/admin");
            return res;
        } catch (e) {
            return e;
        }
    };
    const signupWithEmail = async (
        email: string,
        password: string,
        userName: string
    ) => {
        if (isAuthenticated.value || !$auth) return;
        try {
            toast.value.showToast = true;
            toast.value.messageType = "loading";
            toast.value.message = "註冊中...";
            const res = await createUserWithEmailAndPassword(
                $auth,
                email,
                password
            );
            if (res.user) {
                const user = await getCurrentUser();
                setFirebaseUser(user);
                await getUserData();
                setToken(user.accessToken);

                // 將資料存入realtime db
                const userData = {
                    email: user.email,
                    id: user.uid,
                    name: userName || "",
                    photoURL: user.photoURL || "",
                };
                await set(dbRef($db, `users/${user.uid}`), userData);

                router.push("/admin");
                toast.value.showToast = true;
                toast.value.messageType = "success";
                toast.value.message = "註冊成功!";
            }
            return res;
        } catch (e) {
            toast.value.showToast = true;
            toast.value.messageType = "error";
            toast.value.message = "註冊失敗";
            return e;
        }
    };

    const postsStore = usePostsStore();
    const { userPosts } = storeToRefs(postsStore);
    const resetUserData = () => {
        user.value = null;
        firebaseUser.value = null;
        token.value = null;
        userPosts.value = [];
        router.push("/");
    };
    const LOGOUT = async () => {
        if (!isAuthenticated.value || !$auth) return;
        try {
            const res = await signOut($auth);
            toast.value.showToast = true;
            toast.value.messageType = "success";
            toast.value.message = "登出成功!";
            resetUserData();
            return res;
        } catch (e) {
            return e;
        }
    };
    const DELETEUSER = async () => {
        if (!isAuthenticated.value || !$auth) return;
        const USER = await getCurrentUser();
        try {
            toast.value.showToast = true;
            toast.value.messageType = "loading";
            toast.value.message = "帳號刪除中...";

            // 刪除帳號
            const res = await deleteUser(USER);

            // 刪除帳號在realtime db的資料
            toast.value.message = "刪除user資料中...";
            const userRef = dbRef($db, `users/${USER.uid}`);
            await remove(userRef);

            // 刪除帳號在realtime db posts/[postid]/userId 的資料
            const postsRef = dbRef($db, `posts`);
            const snapshot = await get(postsRef);
            if (snapshot.exists()) {
                toast.value.message = "刪除posts資料中...";
                const deletePromises: Promise<void>[] = [];
                snapshot.forEach((child) => {
                    const post = child.val();
                    if (post.userId === USER.uid) {
                        // 刪除realtime db中的post資料
                        remove(child.ref);
                        // 刪除storage中的post圖片
                        const imageRef = storageRef(
                            $storage,
                            `images/posts/${child.key}`
                        );
                        deletePromises.push(deleteObject(imageRef));
                    }
                });
                await Promise.all(deletePromises);
            }

            // 刪除帳號在storage的user-stickers
            toast.value.message = "刪除user-stickers中...";
            const userPhotoRef = storageRef(
                $storage,
                `user-stickers/${USER.uid}`
            );
            await deleteObject(userPhotoRef);

            toast.value.showToast = true;
            toast.value.messageType = "success";
            toast.value.message = "帳號已刪除!";
            resetUserData();
            return res;
        } catch (e: any) {
            toast.value.showToast = true;
            toast.value.messageType = "error";
            toast.value.message = e;
            return e;
        }
    };

    return {
        signinWithGoogle,
        LOGOUT,
        setToken,
        setFirebaseUser,
        getUserData,
        signupWithEmail,
        signinWithEmail,
        DELETEUSER,
        isAuthenticated,
        user,
        firebaseUser,
        token,
    };
});
