<!-- index.vue -->
<template>
    <div class="home-page w-full relative">
        <client-only>
            <section
                class="banner relative intro bg-slate-100/[0.8] dark:bg-slate-950/[0.4]"
            >
                <div
                    class="flex flex-col justify-center items-center h-[200px]"
                >
                    <h1
                        class="text-center text-3xl xl:text-5xl font-bold mb-4 typing"
                    >
                        {{ h1Text }}
                    </h1>
                    <h2
                        ref="h2Ref"
                        class="text-lg xl:text-2xl font-medium mb-2 text-slate-950 dark:text-slate-50 typing"
                    >
                        {{ h2Text }}
                    </h2>
                </div>
            </section>
        </client-only>
        <div class="container mx-auto">
            <PostList :posts="loadedPosts" :isAdmin="false"></PostList>
        </div>
        <LazyLoadingLists :isLoading="isLoadingPosts" />
    </div>
</template>

<script setup lang="ts">
import { usePendingPromises } from "vuefire";
const {
    public: { siteName },
} = useRuntimeConfig();
useHead({
    title: siteName,
    meta: [
        {
            hid: "description",
            name: "description",
            content: "探索最新的前端技術和工具",
        },
    ],
});
const postsStore = usePostsStore();
onServerPrefetch(() => usePendingPromises());
const { getPosts } = postsStore;
const { loadedPosts, isLoadingPosts } = storeToRefs(postsStore);
const allPostsLoaded = computed(() => {
    return postsStore.allPostsLoaded;
});
const handleScroll = async () => {
    const bottomOfWindow =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 5;

    if (bottomOfWindow && !allPostsLoaded.value) {
        await getPosts(); // 滾動到底部時載入更多文章
    }
};

const h1Text = ref("");
const h2Text = ref("");
const fullH1Text = `${siteName} - 前端技術融合`;
const fullH2Text = "探索最新的前端技術和工具";
const typeEffect = async (text: string, target: { value: string }) => {
    const delay = 40;
    for (let i = 0; i < text.length; i++) {
        target.value += text[i];
        await new Promise((resolve) => setTimeout(resolve, delay));
    }
};

onMounted(async () => {
    await getPosts(); // 初次加載文章
    window.addEventListener("scroll", handleScroll, { passive: true }); // 綁定滾動事件
    // 打字效果
    await typeEffect(fullH1Text, h1Text);
    await typeEffect(fullH2Text, h2Text);
});
onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll); // 移除滾動事件
});
watchEffect(() => {
    if (allPostsLoaded.value && window) {
        window.removeEventListener("scroll", handleScroll);
    }
});
</script>

<style scoped>
.intro {
    position: relative;
    padding: 30px;
    box-sizing: border-box;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    @apply h-[300px] md:h-[480px];
}

h1 {
    background-color: #0093e9;
    background-image: -webkit-linear-gradient(160deg, #0093e9 0%, #80d0c7 80%);
    background-image: -moz-linear-gradient(160deg, #0093e9 0%, #80d0c7 80%);
    background-image: -o-linear-gradient(160deg, #0093e9 0%, #80d0c7 80%);
    background-image: linear-gradient(160deg, #0093e9 0%, #80d0c7 80%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-animation 5s ease infinite;
    background-size: 200% 200%;
}

@keyframes gradient-animation {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
