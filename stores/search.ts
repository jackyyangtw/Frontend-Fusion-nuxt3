export const useSearchStore = defineStore("search", () => {
    const searchText = ref("");
    const setSearchText = (text: string) => {
        searchText.value = text;
    };
    return {
        searchText,
        setSearchText,
    };
});
