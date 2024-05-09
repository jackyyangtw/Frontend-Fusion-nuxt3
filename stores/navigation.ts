export const useNavigationStore = defineStore("navigation", () => {
    const navLinks = ref([
        { title: "分類", to: "/posts" },
        { title: "管理", to: "/auth" },
    ]);
    return {
        navLinks,
    };
});
