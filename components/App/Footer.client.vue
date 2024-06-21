<template>
    <footer v-if="!isPostsPage" class="glass active py-5 text-center">
        © 2024 Frontend Fusion。版權所有，不得轉載
    </footer>
</template>

<script setup lang="ts">
const route = useRoute();
const isPostsPage = computed(() => route.name === "posts");
</script>
