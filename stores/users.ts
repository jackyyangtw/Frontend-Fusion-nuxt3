import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { ref as dbRef, set } from "firebase/database";
export const useUserStore = defineStore("user", () => {
    const { $auth, $db } = useNuxtApp();
    const config = useRuntimeConfig();
    const realTimeDbBaseUrl = config.public.firebaseRealtimeDbBaseUrl as string;

    const user = ref<User | null>(null);
    const firebaseUser = ref<FirebaseUser | null>(null);
    const setFirebaseUser = (userData: any) => {
        firebaseUser.value = userData;
    };
    const getUserData = async () => {
        if (user.value) return;
        await $fetch(
            `${realTimeDbBaseUrl}/users/${firebaseUser.value?.uid}.json`,
            {
                onResponse: ({ response }) => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch user data");
                    }
                    user.value = response._data;
                },
            }
        );
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
    const LOGOUT = async () => {
        if (!isAuthenticated.value || !$auth) return;
        try {
            const res = await signOut($auth);
            toast.value.showToast = true;
            toast.value.messageType = "success";
            toast.value.message = "登出成功!";
            user.value = null;
            firebaseUser.value = null;
            token.value = null;
            userPosts.value = [];
            router.push("/");
            return res;
        } catch (e) {
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
        isAuthenticated,
        user,
        firebaseUser,
        token,
    };
});
