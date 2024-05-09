<template>
    <div>
        <AppHeader />

        <div
            class="min-h-screen w-full relative z-10"
            :class="{ 'flex items-center justify-center': !atPostsPage }"
            :style="{
                paddingTop: atSinglePostPage ? headerHeight + 'px' : '0',
            }"
        >
            <slot
        /></div>
        <UIAuroraBg />
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
const route = useRoute();
const atPostsPage = computed(() => route.name === "posts");
const atSinglePostPage = computed(() => route.name === "posts-id");

const uiStore = useUIStore();
const { headerHeight } = storeToRefs(uiStore);
</script>

<style scoped></style>
