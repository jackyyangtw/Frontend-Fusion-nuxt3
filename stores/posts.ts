import { ref as dbRef, onValue } from "firebase/database";
export const usePostsStore = defineStore("posts", () => {
    const loadedPosts = ref<Post[]>([]);
    const setPosts = (posts: Post[]) => {
        loadedPosts.value = posts;
    };

    const isLoadingPosts = ref(true);
    const setIsLoadingPosts = (isLoading: boolean) => {
        isLoadingPosts.value = isLoading;
    };

    const { $db } = useNuxtApp();
    const getAllPosts = async () => {
        const postRef = dbRef($db, "posts");
        onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            const postArr = [];
            for (const key in data) {
                postArr.push({ ...data[key], id: key });
            }
            postArr.sort(
                (a, b) =>
                    new Date(b.updatedDate).getTime() -
                    new Date(a.updatedDate).getTime()
            );
            loadedPosts.value = postArr;
            setIsLoadingPosts(false);
        });
        // const data = await $fetch<{ [key: string]: Post }>(
        //     "/api/realTime/posts",
        //     {
        //         method: "GET",
        //     }
        // );
        // const postArr = [];
        // for (const key in data) {
        //     postArr.push({ ...data[key], id: key });
        // }
        // loadedPosts.value = postArr;
    };

    return {
        loadedPosts,
        isLoadingPosts,
        setPosts,
        setIsLoadingPosts,
        getAllPosts,
    };
});
