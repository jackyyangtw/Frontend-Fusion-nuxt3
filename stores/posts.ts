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
    const loadedPosts = ref<Post[]>([]);
    const isLoadingPosts = ref(true);
    const postsRef = dbRef($db, "posts");
    const { data: allPosts } = useDatabaseList(postsRef);
    const allPostCount = computed(() => allPosts.value.length);

    const sortedPosts = computed(() => {
        return loadedPosts.value.sort(
            (a, b) =>
                new Date(b.updatedDate).getTime() -
                new Date(a.updatedDate).getTime()
        );
    });
    const allPostsLoaded = computed(() => {
        return loadedPosts.value.length === allPostCount.value;
    });

    // 使用 limit 時載入部分文章，無 limit 時載入全部
    const loadPosts = async (limit: number | null = null) => {
        if (allPostsLoaded.value) return;
        try {
            isLoadingPosts.value = true;
            let postsQuery;

            // 🔥 確保當 `loadedPosts` 為空時，不使用 `startAfter`
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

            const snapshot = await get(postsQuery);
            const posts = snapshot.val();

            if (posts) {
                // 🔥 避免重複載入相同的文章
                const postsArray = Object.keys(posts).map((key) => ({
                    id: key,
                    ...posts[key],
                }));

                const newPosts = postsArray.filter(
                    (post) =>
                        !loadedPosts.value.some(
                            (existingPost) => existingPost.id === post.id
                        )
                );

                loadedPosts.value = [...loadedPosts.value, ...newPosts];
            }
        } catch (error) {
            console.error("Failed to load posts:", error);
        } finally {
            if (import.meta.client) {
                setTimeout(() => {
                    isLoadingPosts.value = false;
                }, 500);
            }
        }
    };
    const getPosts = async () => {
        await loadPosts(6);
    };

    const getRestPosts = async () => await loadPosts();

    // user posts
    const user = useCurrentUser();
    const userId = computed(() => user.value?.uid || null);
    const userPostsQuery = computed(() =>
        userId.value
            ? query(postsRef, orderByChild("userId"), equalTo(userId.value))
            : null
    );
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
        allPosts,
        allUserPostsLoaded,
        allUserPostsCount,
        sortedPosts,
        getPosts,
        getRestPosts,
    };
});
