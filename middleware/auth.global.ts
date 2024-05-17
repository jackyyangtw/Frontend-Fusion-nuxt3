export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();
    const { isAuthenticated } = storeToRefs(userStore);

    const uiStore = useUIStore();
    // const { toast } = storeToRefs(uiStore);
    // if (to.path === "/auth" && isAuthenticated.value) {
    //     return navigateTo("/admin");
    // }
    // if (to.path === "/admin" && !isAuthenticated.value) {
    //     toast.value = {
    //         message: "You need to login to access this page",
    //         messageType: "error",
    //         showToast: true,
    //     };
    //     return navigateTo("/auth");
    // }
    // 初始驗證檢查
    if (process.server && !isAuthenticated.value && to.path !== "/auth") {
        return navigateTo("/auth");
    }

    // 路由變更時的驗證檢查
    if (!process.server && !isAuthenticated.value && to.path !== "/auth") {
        return navigateTo("/auth");
    }
});
