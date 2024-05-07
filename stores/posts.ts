export const usePostsStore = defineStore("posts", () => {
    const loadedPosts = ref<Post[]>([]);
    const setPosts = (posts: Post[]) => {
        loadedPosts.value = posts;
    };

    const isLoadingPosts = ref(true);
    const setIsLoadingPosts = (isLoading: boolean) => {
        isLoadingPosts.value = isLoading;
    };

    const getAllPosts = async () => {
        const data = await $fetch<{ [key: string]: Post }>(
            "/api/realTime/posts",
            {
                method: "GET",
            }
        );
        const postArr = [];
        for (const key in data) {
            postArr.push({ ...data[key], id: key });
        }
        loadedPosts.value = postArr;
    };

    return {
        loadedPosts,
        isLoadingPosts,
        setPosts,
        setIsLoadingPosts,
        getAllPosts,
    };
});
