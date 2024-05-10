// export const useStore = defineStore("state", {
//     state: () => ({
//         token: null,
//         searchText: "",
//         signinWithGoogle: false,
//         navLinks: [
//             { title: "分類", to: "/posts" },
//             { title: "管理", to: "/admin" },
//         ],
//     }),
//     actions: {
//         setSearchText(searchText) {
//             this.searchText = searchText;
//         },
//         setToken(token) {
//             this.token = token;
//         },
//         clearToken() {
//             this.token = null;
//         },
//         setsigninWithGoogle(signinWithGoogle) {
//             this.signinWithGoogle = signinWithGoogle;
//         },
//         async nuxtServerInit(context) {
//             try {
//                 this.post.setIsLoadingPosts(true);
//                 const data = await this.$axios.$get("/posts.json");
//                 const postArr = [];
//                 for (const key in data) {
//                     postArr.push({ ...data[key], id: key });
//                 }
//                 this.post.setPosts(postArr);
//             } catch (e) {
//                 context.error(e);
//             }
//         },
//         async authenticateUserWithEMail(payload) {
//             const authUrl = payload.isLogin
//                 ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKey}`
//                 : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKey}`;

//             try {
//                 const res = await this.$axios.post(authUrl, {
//                     email: payload.email,
//                     password: payload.password,
//                     returnSecureToken: true,
//                 });

//                 if (res.status !== 200) {
//                     throw new Error("認證失敗");
//                 }

//                 const { data } = res;
//                 const { idToken, expiresIn, localId } = data;

//                 this.setToken(idToken);
//                 Cookie.set("jwt", idToken);
//                 Cookie.set(
//                     "tokenExpiration",
//                     new Date().getTime() + Number.parseInt(expiresIn) * 1000
//                 );

//                 const commitData = {
//                     name: payload.name,
//                     email: payload.email,
//                     password: payload.password,
//                     id: localId,
//                 };

//                 const serUserDataToCookie = (data) => {
//                     Cookie.set(`userData`, JSON.stringify(data));
//                 };

//                 const { data: userData } = await this.$axios.get(
//                     `/users/${localId}.json?auth=${idToken}`
//                 );

//                 const initUserData = (userData) => {
//                     serUserDataToCookie(userData);
//                     this.user.setUserData(userData);
//                     this.user.setUserPosts();
//                 };

//                 if (!payload.isLogin) {
//                     await this.$axios.put(
//                         `/users/${localId}.json?auth=${idToken}`,
//                         commitData
//                     );
//                     initUserData(commitData);
//                 } else if (payload.isLogin && userData) {
//                     initUserData(userData);
//                 }
//             } catch (error) {
//                 this.ui.setErrorMsg(error.response.data.error.message);
//             }
//         },
//         async signinWithGoogleAction() {
//             const provider = new this.$auth.GoogleAuthProvider();
//             try {
//                 await this.$authModule.setPersistence(
//                     this.$auth.Auth.Persistence.LOCAL
//                 );
//                 const res = await this.$authModule.signInWithPopup(provider);

//                 const { displayName, email, photoURL, uid } = res.user;
//                 const user = this.$authModule.currentUser;
//                 const token = await user.getIdToken();
//                 const { data: userDataFromFire } = await this.$axios.get(
//                     `/users/${uid}.json?auth=${token}`
//                 );
//                 let userData;

//                 if (!userDataFromFire) {
//                     userData = {
//                         name: displayName,
//                         email,
//                         photoURL,
//                         id: uid,
//                     };
//                     await this.$axios.put(
//                         `/users/${uid}.json?auth=${token}`,
//                         userData
//                     );
//                 } else {
//                     userData = userDataFromFire;
//                 }

//                 Cookie.set(`userData`, JSON.stringify(userData));
//                 Cookie.set("jwt", token);
//                 Cookie.set("signinWithGoogle", true);
//                 this.user.setUserData(userData);
//                 this.setToken(token);
//                 this.user.setUserPosts();

//                 await this.$authModule.signInWithRedirect(provider);
//                 this.setsigninWithGoogle(true);
//             } catch (e) {
//                 console.log(e);
//             }
//         },
//         initAuth(req) {
//             let token;
//             let expirationDate;
//             let signinWithGoogle = false;

//             if (process.client) {
//                 signinWithGoogle = Boolean(Cookie.get("signinWithGoogle"));
//                 this.setsigninWithGoogle(signinWithGoogle);
//             }

//             if (req && req.headers.cookie) {
//                 token = req.headers.cookie
//                     .split(";")
//                     .find((cookie) => cookie.trim().startsWith("jwt="))
//                     ?.split("=")[1];
//                 expirationDate = req.headers.cookie
//                     .split(";")
//                     .find((cookie) =>
//                         cookie.trim().startsWith("tokenExpiration=")
//                     )
//                     ?.split("=")[1];
//             } else if (process.client) {
//                 token = Cookie.get("jwt");
//                 expirationDate = Cookie.get("tokenExpiration");
//                 if (signinWithGoogle) {
//                     this.$authModule.onAuthStateChanged(async (user) => {
//                         if (user) {
//                             const token = await user.getIdToken();
//                             Cookie.set("jwt", token);
//                             const expirationTime =
//                                 new Date().getTime() + 3600 * 1000;
//                             Cookie.set("tokenExpiration", expirationTime);
//                         }
//                     });
//                 }
//             }
//             if (!signinWithGoogle && new Date().getTime() > +expirationDate) {
//                 this.onLogout();
//                 return;
//             }

//             this.setToken(token);
//         },
//         refreshToken() {
//             const timeout = 1000 * 3600;
//             const refreshToken = async () => {
//                 if (!process.client) return;
//                 this.$authModule.onAuthStateChanged(async (user) => {
//                     if (user) {
//                         const token = await user.getIdToken();
//                         Cookie.set("jwt", token);
//                         const expirationTime = new Date().getTime() + timeout;
//                         Cookie.set("tokenExpiration", expirationTime);
//                         this.setToken(token);
//                     }
//                 });
//             };
//             const tokenExpiration = Cookie.get("tokenExpiration");
//             if (tokenExpiration && new Date().getTime() < tokenExpiration) {
//                 refreshToken();
//             }
//             setInterval(refreshToken, timeout + 1000);
//         },
//         onLogout() {
//             this.clearCookie();
//         },
//         clearCookie() {
//             Cookie.remove("jwt");
//             Cookie.remove("tokenExpiration");
//             Cookie.remove("userData");
//             Cookie.remove("signinWithGoogle");
//             this.clearToken();
//             this.user.setUserData(null);
//             this.user.setUserPosts(null);
//             this.setsigninWithGoogle(false);
//         },
//     },
//     getters: {
//         isAuthenticated: (state) => state.token != null,
//         searchText: (state) => state.searchText,
//         signinWithGoogle: (state) => {
//             const signinWithGoogle = Boolean(Cookie.get("signinWithGoogle"));
//             return signinWithGoogle && state.signinWithGoogle;
//         },
//         navLinks: (state) => state.navLinks,
//     },
// });
