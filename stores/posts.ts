// import type { Post } from "../types/posts";
export const usePostsStore = defineStore("posts", {
    state: () => ({
        loadedPosts: [] as Post[],
        isLoadingPosts: true,
    }),
    actions: {
        setPosts(posts: Post[]) {
            this.loadedPosts = posts;
        },
        setIsLoadingPosts(isLoading: boolean) {
            this.isLoadingPosts = isLoading;
        },
        async getAllPosts() {
            const data = await $fetch<Post>("/api/GET/posts");
            const postArr = [];
            for (const key in data) {
                postArr.push({ ...data[key], id: key });
            }
            this.loadedPosts = postArr;
        },
    },
});
