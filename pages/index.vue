<template>
    <div class="home-page w-full">
        <section
            class="banner relative intro bg-slate-100/[0.8] dark:bg-slate-950/[0.4]"
        >
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
                :isAdmin="false"
            ></post-list>
        </div>
    </div>
</template>

<script setup lang="ts">
// import { storeToRefs } from "pinia";
useHead({
    title: "Frontend Fusion",
    meta: [
        {
            hid: "description",
            name: "description",
            content: "Frontend Fusion",
        },
    ],
});
const postsStore = usePostsStore();
const { loadedPosts, isLoadingPosts } = storeToRefs(postsStore);
onMounted(() => {
    isLoadingPosts.value = false;
});
</script>

<style scoped>
.intro {
    height: 480px;
    position: relative;
    padding: 30px;
    box-sizing: border-box;
    background-position: bottom;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

h1 {
    background-image: -webkit-linear-gradient(92deg, #f35626, #feab3a);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: hue 10s infinite linear;
}
@keyframes hue {
    from {
        -webkit-filter: hue-rotate(0deg);
        background-position: 0% 50%;
    }
    to {
        -webkit-filter: hue-rotate(-360deg);
        background-position: 100% 50%;
    }
}
</style>
