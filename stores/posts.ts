import {
    ref as dbRef,
    onValue,
    query,
    limitToFirst,
    startAfter,
    get,
} from "firebase/database";
export const usePostsStore = defineStore("posts", () => {
    const loadedPosts = ref<Post[]>([]);

    const isLoadingPosts = ref(true);

    const { $db } = useNuxtApp();
    const getAllPosts = async () => {
        isLoadingPosts.value = true;
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
        });
    };

    const lastPostKey = ref<string | null>(null);
    const postsPerPage = 6; // 每次載入 6 筆資料
    const getPosts = async () => {
        if (!isLoadingPosts.value) {
            isLoadingPosts.value = true;

            let postQuery = query(
                dbRef($db, "posts"),
                limitToFirst(postsPerPage)
            );
            if (lastPostKey.value) {
                postQuery = query(
                    dbRef($db, "posts"),
                    startAfter(lastPostKey.value),
                    limitToFirst(postsPerPage)
                );
            }

            const snapshot = await get(postQuery);
            const data = snapshot.val();
            const postArr = [];
            for (const key in data) {
                postArr.push({ ...data[key], id: key });
            }

            if (postArr.length > 0) {
                lastPostKey.value = postArr[postArr.length - 1].id;
                loadedPosts.value = [...loadedPosts.value, ...postArr];
            }

            isLoadingPosts.value = false;
        }
    };

    return {
        loadedPosts,
        isLoadingPosts,
        getAllPosts,
        getPosts,
    };
});
