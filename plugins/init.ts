// import type { Post } from "../types/posts";
// import type { Ref } from "vue";
export default defineNuxtPlugin(async (nuxtApp) => {
    // const config = useRuntimeConfig();
    // const postsStore = usePostsStore();
    // const tagsStore = useTagsStore();
    // try {
    //     // const { data: posts } = await useFetch<Ref<Post[]>>(
    //     //     `${config.public.firebaseBaseUrl}/posts.json`
    //     // );
    //     const data: Post = await $fetch(
    //         `${config.public.firebaseBaseUrl}/posts.json`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             onResponse: ({ response }) => {
    //                 if (!response.ok) {
    //                     throw new Error("Failed to fetch posts");
    //                 }
    //                 // console.log(response._data);
    //                 return response._data;
    //             },
    //         }
    //     );
    //     const postArr = [];
    //     for (const key in data) {
    //         postArr.push({ ...data[key], id: key });
    //     }
    //     postsStore.setPosts(postArr);
    //     await tagsStore.getTags();
    // } catch (error) {
    //     console.error("Failed to fetch posts:", error);
    // }
});
