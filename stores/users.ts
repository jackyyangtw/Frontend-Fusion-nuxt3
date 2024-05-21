import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
export const useUserStore = defineStore("user", () => {
    const { $auth } = useNuxtApp();
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
            if (res.user) {
            }
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

    const googleSignout = async () => {
        if (!isAuthenticated.value || !$auth) return;
        try {
            const res = await signOut($auth);
            toast.value.showToast = true;
            toast.value.messageType = "success";
            toast.value.message = "登出成功!";
            user.value = null;
            firebaseUser.value = null;
            token.value = null;
            router.push("/");
            return res;
        } catch (e) {
            return e;
        }
    };

    return {
        signinWithGoogle,
        googleSignout,
        setToken,
        setFirebaseUser,
        getUserData,
        isAuthenticated,
        user,
        firebaseUser,
        token,
    };
});
