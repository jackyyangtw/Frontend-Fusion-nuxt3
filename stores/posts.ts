// posts.ts
import {
    ref as dbRef,
    query,
    orderByChild,
    equalTo,
    get,
    limitToFirst,
    startAfter,
    orderByKey,
} from "firebase/database";

export const usePostsStore = defineStore("posts", () => {
    const { $db } = useNuxtApp();

    // All posts
    const postsRef = dbRef($db, "posts");
    const loadedPosts = ref<Post[]>([]);
    const isLoadingPosts = ref(true);
    const { data: allPosts } = useDatabaseList(postsRef);
    const allPostCount = computed(() => allPosts.value.length);
    const allPostsLoaded = computed(() => {
        return loadedPosts.value.length === allPostCount.value;
    });
    const sortedPosts = computed(() => {
        return loadedPosts.value.sort(
            (a, b) =>
                new Date(b.updatedDate).getTime() -
                new Date(a.updatedDate).getTime()
        );
    });

    const loadPosts = async (limit: number | null = null) => {
        if (allPostsLoaded.value) return;
        try {
            isLoadingPosts.value = true;
            let postsQuery;

            if (loadedPosts.value.length > 0) {
                const lastLoadedPostId =
                    loadedPosts.value[loadedPosts.value.length - 1].id;
                postsQuery = limit
                    ? query(
                          postsRef,
                          orderByKey(),
                          startAfter(lastLoadedPostId),
                          limitToFirst(limit)
                      )
                    : query(
                          postsRef,
                          orderByKey(),
                          startAfter(lastLoadedPostId)
                      );
            } else {
                postsQuery = limit
                    ? query(postsRef, orderByKey(), limitToFirst(limit))
                    : query(postsRef, orderByKey());
            }

            const posts = useDatabaseList<Post>(postsQuery);
            if (posts.value) {
                const uniquePosts = posts.value.filter(
                    (newPost) =>
                        !loadedPosts.value.some(
                            (post) => post.id === newPost.id
                        )
                );

                if (uniquePosts.length > 0) {
                    loadedPosts.value = [...loadedPosts.value, ...uniquePosts];
                }
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
        } finally {
            setTimeout(() => {
                isLoadingPosts.value = false;
            }, 500);
        }
    };

    // 使用 limit 時載入部分文章，無 limit 時載入全部
    const getPosts = async () => await loadPosts(6);
    const getRestPosts = async () => await loadPosts();

    // user posts
    const user = useCurrentUser();
    const userId = user.value?.uid;
    const userPostsQuery = userId
        ? query(postsRef, orderByChild("userId"), equalTo(userId))
        : null;
    const userPosts = useDatabaseList<Post>(userPostsQuery);
    const allUserPostsCount = computed(() => userPosts.value.length);
    const allUserPostsLoaded = computed(() => {
        return (
            userPosts.value.length === allUserPostsCount.value &&
            allUserPostsCount.value > 0
        );
    });

    return {
        loadedPosts,
        isLoadingPosts,
        allPostCount,
        allPostsLoaded,
        userPosts,
        allUserPostsLoaded,
        allUserPostsCount,
        sortedPosts,
        getPosts,
        getRestPosts,
    };
});
