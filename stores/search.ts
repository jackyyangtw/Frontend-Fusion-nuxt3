export const useSearchStore = defineStore("search", () => {
    const searchText = ref("");
    return {
        searchText,
    };
});
