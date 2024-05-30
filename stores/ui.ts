export const useUIStore = defineStore("ui", () => {
    const headerHeight = ref(60);
    const setHeaderHeight = (height: number) => {
        headerHeight.value = height;
    };

    const pageLoading = ref(false);
    const setPageLoading = (value: boolean) => {
        pageLoading.value = value;
    };

    const toast = ref({
        showToast: false,
        message: "",
        messageType: "success",
    });

    const isModalOpen = ref(false);

    return {
        headerHeight,
        setHeaderHeight,
        pageLoading,
        setPageLoading,
        toast,
        isModalOpen,
    };
});
