<template>
    <NuxtLayout>
        <NuxtPage />
        <AppToast
            :showToast="toast.showToast"
            :type="toast.messageType"
            :message="toast.message"
            @closeToast="closeToast"
        />
        <LoadingPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const tagsStore = useTagsStore();
const userStore = useUserStore();
const uiStore = useUIStore();
const { toast } = storeToRefs(uiStore);
const closeToast = () => {
    toast.value.showToast = false;
};
const localContent = useLocalStorage("editorContent", "");
localContent.value = "";
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
</script>

<style>
body {
    @apply bg-slate-100 dark:bg-slate-800 transition duration-300;
}
.layout-enter-active,
.layout-leave-active {
    transition: 0.3s;
}
.layout-enter-from,
.layout-leave-to {
    opacity: 0;
    /* filter: blur(1rem); */
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.vagueIn-enter-from,
.vagueIn-leave-to {
    filter: blur(20px);
    opacity: 0.5;
}

.vagueIn-enter-active,
.vagueIn-leave-active {
    transition: 0.3s;
}
</style>
