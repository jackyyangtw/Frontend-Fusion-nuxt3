import {
    ref as dbRef,
    onValue,
    query,
    orderByChild,
    equalTo,
    get,
    type DatabaseReference,
    type Query,
} from "firebase/database";

export const usePostsStore = defineStore("posts", () => {
    const loadedPosts = ref<Post[]>([]);
    const isLoadingPosts = ref(true);
    const allPostCount = ref(0);
    const userPosts = ref<Post[]>([]);
    const allUserPostsCount = ref(0);

    const { $db } = useNuxtApp();
    const user = useCurrentUser();

    const allPostsLoaded = computed(() => {
        return loadedPosts.value.length === allPostCount.value;
    });

    const allUserPostsLoaded = computed(() => {
        return (
            userPosts.value.length === allUserPostsCount.value &&
            allUserPostsCount.value > 0
        );
    });

    // utils
    const fetchPosts = (
        postRef: Query | DatabaseReference,
        targetArray: Ref<Post[]>,
        existingArray: Ref<Post[]>
    ) => {
        onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            const postArr: Post[] = [];
            for (const key in data) {
                const existingIndex = existingArray.value.findIndex(
                    (post) => post.id === key
                );
                if (existingIndex === -1) {
                    postArr.push({ ...data[key], id: key });
                } else {
                    // 更新現有的文章
                    existingArray.value[existingIndex] = {
                        ...data[key],
                        id: key,
                    };
                }
            }
            postArr.sort(
                (a, b) =>
                    new Date(b.updatedDate).getTime() -
                    new Date(a.updatedDate).getTime()
            );
            targetArray.value = [...existingArray.value, ...postArr];
        });
    };

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

    // methods
    const getAllPosts = () => {
        isLoadingPosts.value = true;
        const postRef = dbRef($db, "posts");
        fetchPosts(postRef, loadedPosts, loadedPosts);
    };

    const getAllPostsCount = async () => {
        const postsRef = dbRef($db, "posts");
        await fetchPostCount(postsRef, allPostCount);
    };

    const getUserPosts = async () => {
        const userId = user.value?.uid;
        if (!userId) return;
        console.log("Getting user posts");

        isLoadingPosts.value = true;
        const postRef = dbRef($db, "posts");
        const userPostsQuery = query(
            postRef,
            orderByChild("userId"),
            equalTo(userId)
        );
        fetchPosts(userPostsQuery, userPosts, userPosts);
    };

    const getAllUserPostsCount = async () => {
        const userId = user.value?.uid;
        if (!userId) {
            allUserPostsCount.value = 0;
            return;
        }
        const userPostsQuery = query(
            dbRef($db, "posts"),
            orderByChild("userId"),
            equalTo(userId)
        );
        await fetchPostCount(userPostsQuery, allUserPostsCount);
    };

    return {
        loadedPosts,
        isLoadingPosts,
        allPostCount,
        allPostsLoaded,
        userPosts,
        allUserPostsLoaded,
        allUserPostsCount,
        getAllPosts,
        getAllPostsCount,
        getUserPosts,
        getAllUserPostsCount,
    };
});
