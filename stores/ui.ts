export const useUIStore = defineStore("ui", {
    state: () => ({
        headerHeight: 0,
    }),
    actions: {
        setHeaderHeight(height: number) {
            this.headerHeight = height;
        },
    },
});
