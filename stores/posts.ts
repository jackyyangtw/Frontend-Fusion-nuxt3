// posts.ts
import {
    ref as dbRef,
    onValue,
    query,
    orderByChild,
    equalTo,
    get,
    limitToFirst,
    startAfter,
    orderByKey,
    type DatabaseReference,
    type Query,
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

    // const getRestPosts = async () => {
    //     if (allPostsLoaded.value) return; // 如果已載入所有文章，則返回
    //     isLoadingPosts.value = true;
    //     console.log("Loading the rest of the posts...");
    //     try {
    //         let postsQuery;

    //         if (loadedPosts.value.length > 0) {
    //             const lastLoadedPostId =
    //                 loadedPosts.value[loadedPosts.value.length - 1].id;
    //             postsQuery = query(
    //                 postsRef,
    //                 orderByKey(),
    //                 startAfter(lastLoadedPostId)
    //             );
    //         } else {
    //             postsQuery = query(postsRef, orderByKey());
    //         }

    //         const snapshot = await get(postsQuery);
    //         const posts = snapshot.val();

    //         if (posts) {
    //             const postsArray = Object.keys(posts).map((key) => ({
    //                 id: key,
    //                 ...posts[key],
    //             }));

    //             const uniquePosts = postsArray.filter(
    //                 (newPost) =>
    //                     !loadedPosts.value.some(
    //                         (post) => post.id === newPost.id
    //                     )
    //             );

    //             if (uniquePosts.length > 0) {
    //                 loadedPosts.value = [...loadedPosts.value, ...uniquePosts];
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Failed to load the rest of the posts:", error);
    //     }
    //     isLoadingPosts.value = false;
    // };
    // const getPosts = async (limit = 3) => {
    //     if (allPostsLoaded.value) return; // 如果已載入所有文章，則返回
    //     isLoadingPosts.value = false;
    //     console.log("Loading more posts...");
    //     try {
    //         let postsQuery;

    //         if (loadedPosts.value.length > 0) {
    //             const lastLoadedPostId =
    //                 loadedPosts.value[loadedPosts.value.length - 1].id;
    //             postsQuery = query(
    //                 postsRef,
    //                 orderByKey(),
    //                 startAfter(lastLoadedPostId),
    //                 limitToFirst(limit)
    //             );
    //         } else {
    //             postsQuery = query(postsRef, orderByKey(), limitToFirst(limit));
    //         }

    //         const snapshot = await get(postsQuery);
    //         const posts = snapshot.val();

    //         const hasSamePosts = Object.keys(posts).some((key) =>
    //             loadedPosts.value.some((post) => post.id === key)
    //         );
    //         if (posts && !hasSamePosts) {
    //             // 檢查loadedPosts是否已有此文章，避免重複載入
    //             const postsArray = Object.keys(posts).map((key) => ({
    //                 id: key,
    //                 ...posts[key],
    //             }));
    //             loadedPosts.value = [...loadedPosts.value, ...postsArray];
    //         }
    //     } catch (error) {
    //         console.error("Failed to load posts:", error);
    //     }
    //     isLoadingPosts.value = false;
    // };
    const loadPosts = async (limit: number | null = null) => {
        if (allPostsLoaded.value) return;

        isLoadingPosts.value = true;

        try {
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

            const snapshot = await get(postsQuery);
            const posts = snapshot.val();

            if (posts) {
                const postsArray = Object.keys(posts).map((key) => ({
                    id: key,
                    ...posts[key],
                }));

                const uniquePosts = postsArray.filter(
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
        }
        isLoadingPosts.value = false;
    };

    // 使用 limit 時載入部分文章，無 limit 時載入全部
    const getPosts = () => loadPosts(3);
    const getRestPosts = () => loadPosts();

    // utils
    // const fetchPosts = (
    //     postRef: Query | DatabaseReference,
    //     targetArray: Ref<Post[]>,
    //     existingArray: Ref<Post[]>
    // ) => {
    //     onValue(postRef, (snapshot) => {
    //         const data = snapshot.val();
    //         const postArr: Post[] = [];
    //         for (const key in data) {
    //             const existingIndex = existingArray.value.findIndex(
    //                 (post) => post.id === key
    //             );
    //             if (existingIndex === -1) {
    //                 postArr.push({ ...data[key], id: key });
    //             } else {
    //                 // 更新現有的文章
    //                 existingArray.value[existingIndex] = {
    //                     ...data[key],
    //                     id: key,
    //                 };
    //             }
    //         }
    //         postArr.sort(
    //             (a, b) =>
    //                 new Date(b.updatedDate).getTime() -
    //                 new Date(a.updatedDate).getTime()
    //         );
    //         targetArray.value = [...existingArray.value, ...postArr];
    //     });
    // };

    const fetchPostCount = async (
        postsRef: Query | DatabaseReference,
        countRef: Ref<number>
    ) => {
        try {
            const snapshot = await get(postsRef);
            if (snapshot.exists()) {
                const postsData = snapshot.val();
                countRef.value = Object.keys(postsData).length;
            } else {
                countRef.value = 0;
            }
        } catch (error) {
            console.error("Error fetching post count:", error);
            countRef.value = 0;
        }
    };

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

    // const userPosts = ref<Post[]>([]);
    const getUserPosts = async () => {
        // const userId = user.value?.uid;
        // if (!userId) return;
        // isLoadingPosts.value = true;
        // const userPostsQuery = query(
        //     postsRef,
        //     orderByChild("userId"),
        //     equalTo(userId)
        // );
        // const data = useDatabaseList<Post>(userPostsQuery);
        // console.log(data.value);
        // userPosts.value = data.value;
        // // fetchPosts(userPostsQuery, userPosts, userPosts);
    };

    // const allUserPostsCount = ref(0);
    // const allUserPostsLoaded = computed(() => {
    //     return (
    //         userPosts.value.length === allUserPostsCount.value &&
    //         allUserPostsCount.value > 0
    //     );
    // });
    const getAllUserPostsCount = async () => {
        // const userId = user.value?.uid;
        // if (!userId) {
        //     allUserPostsCount.value = 0;
        //     return;
        // }
        // const userPostsQuery = query(
        //     postsRef,
        //     orderByChild("userId"),
        //     equalTo(userId)
        // );
        // await fetchPostCount(userPostsQuery, allUserPostsCount);
    };

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
        getUserPosts,
        getAllUserPostsCount,
    };
});
