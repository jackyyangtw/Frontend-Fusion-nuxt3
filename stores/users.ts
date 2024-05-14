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

    const signinWithGoogle = async () => {
        if (isAuthenticated.value) return;
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup($auth, provider);
            const user = await getCurrentUser();
            setFirebaseUser(user);
            await getUserData();
            setToken(user.accessToken);
            return res;
        } catch (e) {
            return e;
        }
    };
    const signout = async () => {
        if (!isAuthenticated.value) return;
        try {
            const res = await signOut($auth);
            user.value = null;
            firebaseUser.value = null;
            token.value = null;
            return res;
        } catch (e) {
            return e;
        }
    };

    return {
        signinWithGoogle,
        signout,
        setToken,
        setFirebaseUser,
        getUserData,
        isAuthenticated,
        user,
        firebaseUser,
        token,
    };
});
