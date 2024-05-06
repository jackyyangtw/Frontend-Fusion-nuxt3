<template>
    <div class="home-page">
        <section
            class="banner relative intro bg-slate-100/[0.8] dark:bg-slate-950/[0.4]"
        >
            <!-- <div class="w-full" :style="placeHolderHeight"></div> -->
            <div
                class="rounded-md p-6 min-h-[200px] mx-auto"
                style="z-index: 3"
            >
                <div
                    class="flex flex-col justify-center items-center h-[200px]"
                >
                    <h1 class="text-center text-3xl xl:text-5xl font-bold mb-4">
                        Frontend Fusion - 前端技術融合
                    </h1>
                    <h2
                        class="text-lg xl:text-2xl font-medium mb-2 text-slate-950 dark:text-slate-50"
                    >
                        探索最新的前端技術和工具
                    </h2>
                </div>
            </div>
        </section>
        <div class="container mx-auto">
            <post-list
                v-if="loadedPosts.length > 0"
                :posts="loadedPosts"
                :loadingPosts="isLoadingPosts"
                isAdmin
            ></post-list>
        </div>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const postsStore = usePostsStore();
const { loadedPosts, isLoadingPosts } = storeToRefs(postsStore);

const tagsStore = useTagsStore();
try {
    await postsStore.getAllPosts();
    await tagsStore.getTags();
    isLoadingPosts.value = false;
} catch (error) {
    console.error("Failed to fetch posts:", error);
}
</script>

<style lang="scss" scoped></style>
