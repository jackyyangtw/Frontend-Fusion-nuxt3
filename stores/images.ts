export const useImagesStore = defineStore("images", {
    state: () => ({
        loadedImages: [] as string[],
        cachedImages: {},
    }),
    actions: {
        loadImage(url: string) {
            if (!this.loadedImages.includes(url)) {
                this.loadedImages.push(url);
            }
        },
        // cacheImage(imgSrc: string) {
        //     if (!this.cachedImages[imgSrc]) {
        //         this.cachedImages[imgSrc] = imgSrc;
        //     }
        // },
    },
    getters: {
        getCachedImage: (state) => (imgSrc: string) => {
            return state.cachedImages[imgSrc];
        },
    },
});
