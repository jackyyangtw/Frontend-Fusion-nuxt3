export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = await getCurrentUser();
    const uiStore = useUIStore();
    const { toast } = storeToRefs(uiStore);
    if (process.client) {
        if (to.path === "/admin" && !user) {
            toast.value.showToast = true;
            toast.value.messageType = "error";
            toast.value.message = "請先登入!";
            return navigateTo("/auth");
        }
        if (to.path === "/auth" && user) {
            return navigateTo("/admin");
        }
    }
});
