export const useUIStore = defineStore("ui", () => {
    const headerHeight = ref(60);

    const setHeaderHeight = (height: number) => {
        headerHeight.value = height;
    };

    const loading = ref(false);
    const setLoading = (value: boolean) => {
        loading.value = value;
    };

    return {
        headerHeight,
        setHeaderHeight,
        loading,
        setLoading,
    };
});
