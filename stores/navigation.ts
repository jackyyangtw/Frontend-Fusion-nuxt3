export const useNavigationStore = defineStore("navigation", () => {
    const userStore = useUserStore();
    const { isAuthenticated } = storeToRefs(userStore);
    const navLinks = ref([
        { title: "分類", to: "/posts" },
        { title: "管理", to: "/admin" },
        { title: "登入/註冊", to: "/auth" },
    ]);

    const filteredNavLinks = computed(() => {
        if (isAuthenticated.value) {
            return navLinks.value.filter((link) => link.title !== "登入/註冊");
        }
        return navLinks.value.filter((link) => link.title !== "管理");
    });
    return {
        navLinks,
        filteredNavLinks,
    };
});
