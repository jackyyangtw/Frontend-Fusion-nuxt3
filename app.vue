<template>
    <NuxtLayout>
        <NuxtPage />
        <AppToast
            :showToast="toast.showToast"
            :type="toast.messageType"
            :message="toast.message"
            @closeToast="closeToast"
        />
    </NuxtLayout>
</template>

<script setup lang="ts">
const { public: { siteName }} = useRuntimeConfig();
useSchemaOrg([
    defineWebSite({
        name: siteName,
    })
])
const tagsStore = useTagsStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const { toast, appLoading } = storeToRefs(uiStore);
const closeToast = () => {
    toast.value.showToast = false;
};
// const localContent = useLocalStorage("editorContent", "");
// localContent.value = "";
try {
    await tagsStore.getAllTags();
    const firebaseUserData = await getCurrentUser();
    if (firebaseUserData) {
        userStore.setFirebaseUser(firebaseUserData);
        userStore.setToken(firebaseUserData.accessToken);
        await userStore.getUserData();
    }
} catch (error) {
    console.error("Failed to fetch posts:", error);
}
onMounted(() => {
    appLoading.value = false;
});
</script>

<style>
body {
    @apply bg-slate-100 dark:bg-slate-800 transition duration-300 relative;
}
</style>
