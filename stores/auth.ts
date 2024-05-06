export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: "",
    }),
    actions: {
        async authenticateUserWithEMail(authData: AuthData) {
            // authData.isLogin 是從 auth頁面tab傳過來的，判斷是否為登入模式
            const authUrl = authData.isLogin
                ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKey}`
                : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKey}`;
            try {
                const res = await $fetch<AuthData>(authUrl, {
                    method: "POST",
                    body: {
                        email: authData.email,
                        password: authData.password,
                        returnSecureToken: true,
                    },
                    onResponseError: ({ response }) => {
                        if (response.status !== 200) {
                            throw new Error("認證失敗");
                        }
                    },
                });
                const { data } = res;
                const { idToken, expiresIn, localId } = data;
                this.token = idToken;
                Cookie.set("jwt", idToken);
                Cookie.set(
                    "tokenExpiration",
                    new Date().getTime() + Number.parseInt(expiresIn) * 1000
                );
                const commitData = {
                    name: authData.name,
                    email: authData.email,
                    password: authData.password,
                    id: localId,
                };
                const serUserDataToCookie = (data) => {
                    Cookie.set(`userData`, JSON.stringify(data));
                };
                const { data: userData } = await this.$axios.get(
                    `/users/${localId}.json?auth=${idToken}`
                );
                const initUserData = (userData) => {
                    serUserDataToCookie(userData);
                    vuexContext.commit("user/setUserData", userData);
                    vuexContext.dispatch("user/setUserData");
                    vuexContext.dispatch("user/setUserPosts");
                };
                if (!authData.isLogin) {
                    await this.$axios.put(
                        `/users/${localId}.json?auth=${idToken}`,
                        commitData
                    );
                    initUserData(commitData);
                } else if (authData.isLogin && userData) {
                    initUserData(userData);
                }
            } catch (error) {
                vuexContext.dispatch(
                    "ui/setErrorMsg",
                    error.response.data.error.message
                );
            }
        },
    },
});
