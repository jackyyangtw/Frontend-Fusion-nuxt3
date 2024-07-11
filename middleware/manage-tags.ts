export default defineNuxtRouteMiddleware(async (to, from) => {
    const USER = await getCurrentUser();
    const userStore = useUserStore();
    const { user } = storeToRefs(userStore);
    const { toast } = storeToRefs(useUIStore());
    if (!USER) {
        return navigateTo('/auth');
    } 
    userStore.$onAction(({ after }) => {
        after(async () => {
            if(!user.value) {
                await userStore.getUserData();
            }
            if(user.value && !user.value.isManager) {
                toast.value = {
                    showToast: true,
                    message: '您沒有權限進入此頁面',
                    messageType: 'error'
                }
                return navigateTo('/admin');
            } 
        });
    });
    
});