<template>
    <footer v-if="!isPostsPage" class="glass active py-5 text-center">
        © {{ thisYear }} {{ siteName }}。版權所有，轉載請註明出處
    </footer>
</template>

<script setup lang="ts">
const route = useRoute();
const isPostsPage = computed(() => route.name === "posts");
const { public: { siteName }} = useRuntimeConfig();
const thisYear = new Date().getFullYear();
</script>
