import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
export const useAuthStore = defineStore("auth", () => {
    const { $auth } = useNuxtApp();

    const idToken = ref<string | null>(null);
    const isAuthenicated = computed(() => idToken.value !== null);
    const signinWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const res = await signInWithPopup($auth, provider);

            const { displayName, email, photoURL, uid } = res.user;
            const user = $auth.currentUser;
            const token = await user.getIdToken();
            idToken.value = token;

            // const config = useRuntimeConfig();
            // const { data: userDataFromFire } = await useFetch(
            //     `${config.public.firebaseBaseUrl}/users/${uid}.json?auth=${token}`
            // );
            // let userData;

            // // 檢查是否有該用戶資料，沒有就新增
            // if (!userDataFromFire) {
            //     userData = {
            //         name: displayName,
            //         email,
            //         photoURL,
            //         id: uid,
            //     };
            //     await useFetch(
            //         `${config.public.firebaseBaseUrl}/users/${uid}.json?auth=${token}`,
            //         {
            //             method: "PUT",
            //             body: userData,
            //         }
            //     );
            // } else {
            //     userData = userDataFromFire;
            // }

            // const userData = useCookie("userData", userData);

            // Cookie.set(`userData`, JSON.stringify(userData));
            // Cookie.set("jwt", token);
            // Cookie.set("signinWithGoogle", true);
            // vuexContext.commit("user/setUserData", userData);
            // vuexContext.commit("setToken", token);
            // vuexContext.dispatch("user/setUserPosts");

            // await $auth.signInWithRedirect(provider);
            // vuexContext.commit("setsigninWithGoogle", true);
        } catch (e) {
            console.log(e);
        }
    };
    return { signinWithGoogle, isAuthenicated };
});
