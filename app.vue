<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
const postsStore = usePostsStore();
const { isLoadingPosts } = storeToRefs(postsStore);

const tagsStore = useTagsStore();
try {
    await postsStore.getAllPosts();
    await tagsStore.getAllTags();
    isLoadingPosts.value = false;
} catch (error) {
    console.error("Failed to fetch posts:", error);
}
</script>
