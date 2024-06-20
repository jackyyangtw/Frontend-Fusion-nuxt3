<template>
    <RenderCacheable
        class="w-full pt-0 lg:pt-6 p-6 flex flex-wrap items-center justify-start container mx-auto relative z-10"
    >
        <post-preview
            v-for="(post, index) in posts"
            :is-admin="isAdmin"
            :key="post.id"
            :post="post"
            :index="index"
        >
        </post-preview>
    </RenderCacheable>
</template>

<script setup lang="ts">
defineProps<{
    isAdmin: boolean;
    posts: Post[];
}>();
</script>
