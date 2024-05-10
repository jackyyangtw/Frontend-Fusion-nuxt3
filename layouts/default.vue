<template>
    <div>
        <AppHeader />

        <div
            class="min-h-screen w-full relative z-10"
            :style="{
                paddingTop:
                    atSinglePostPage || atAdminPage ? headerHeight + 'px' : '0',
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
const atAdminPage = computed(() => route.name === "admin");

const uiStore = useUIStore();
const { headerHeight } = storeToRefs(uiStore);
</script>

<style scoped></style>
