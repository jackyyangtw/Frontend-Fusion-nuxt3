export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();
    const uiStore = useUIStore();
    const { toast } = storeToRefs(uiStore);
    if (!process.client) {
        return;
    }
    if (to.path.includes("/admin") && !user) {
        toast.value.showToast = true;
        toast.value.messageType = "error";
        toast.value.message = "請先登入!";
        return navigateTo("/auth");
    }
    if (to.path === "/auth" && user) {
        // toast.value.showToast = true;
        // toast.value.messageType = "success";
        // toast.value.message = "您已登入不須再驗證!";
        return navigateTo("/admin");
    }
});
