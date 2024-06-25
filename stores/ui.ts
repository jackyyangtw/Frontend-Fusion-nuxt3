export const useUIStore = defineStore("ui", () => {
    const headerHeight = ref(60);
    const setHeaderHeight = (height: number) => {
        headerHeight.value = height;
    };

    const pageLoading = ref(false);
    const setPageLoading = (value: boolean) => {
        pageLoading.value = value;
    };

    const appLoading = ref(true);

    const toast = ref({
        showToast: false,
        message: "",
        messageType: "success",
    });

    const isModalOpen = ref(false);

    const isSidenavOpen = ref(false);

    return {
        headerHeight,
        pageLoading,
        setHeaderHeight,
        setPageLoading,
        toast,
        isModalOpen,
        appLoading,
        isSidenavOpen,
    };
});
