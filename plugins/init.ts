export default defineNuxtPlugin(async (nuxtApp) => {
    try {
        const { $fetch } = nuxtApp;
        const data = await $fetch("/post");
        const postArr = [];
        for (const key in data) {
            postArr.push({ ...data[key], id: key });
        }
        return postArr;
    } catch (e: any) {
        // Handle errors
        return e.message;
    }
});
