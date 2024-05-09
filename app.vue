<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const postsStore = usePostsStore();

const tagsStore = useTagsStore();
try {
    await postsStore.getAllPosts();
    await tagsStore.getAllTags();
} catch (error) {
    console.error("Failed to fetch posts:", error);
}
</script>

<style>
body {
    @apply bg-slate-100 dark:bg-slate-800;
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
</style>
