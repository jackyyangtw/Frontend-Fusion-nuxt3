// import { storeToRefs } from "pinia";
// import { usePostStore } from "@/stores/postStore";
// import {
//     ref as dbRef,
//     query,
//     orderByKey,
//     startAfter,
//     limitToFirst,
//     get,
// } from "firebase/database";
// export default defineEventHandler(async (event) => {
//     const postStore = usePostStore();
//     const { loadedPosts, isLoadingPosts, allPostsLoaded, maxPerPage } =
//         storeToRefs(postStore); // 使用 storeToRefs 來取得 pinia 的 ref

//     if (allPostsLoaded.value) return; // 如果已載入所有文章，則返回
//     isLoadingPosts.value = true;
//     console.log("Loading more posts...");
//     const { $db } = useNuxtApp();
//     try {
//         const postsRef = dbRef($db, "posts");
//         let postsQuery;

//         if (loadedPosts.value.length > 0) {
//             const lastLoadedPostId =
//                 loadedPosts.value[loadedPosts.value.length - 1].id;
//             postsQuery = query(
//                 postsRef,
//                 orderByKey(),
//                 startAfter(lastLoadedPostId),
//                 limitToFirst(maxPerPage.value)
//             );
//         } else {
//             postsQuery = query(
//                 postsRef,
//                 orderByKey(),
//                 limitToFirst(maxPerPage.value)
//             );
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
// });
