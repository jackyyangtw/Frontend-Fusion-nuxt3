<template>
    <div class="home-page w-full relative">
        <client-only>
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
                        <h1
                            class="text-center text-3xl xl:text-5xl font-bold mb-4"
                        >
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
        </client-only>
        <div class="container mx-auto">
            <PostList :posts="loadedPosts" :isAdmin="false"></PostList>
        </div>
        <LoadingLists :isLoading="isLoadingPosts" />
    </div>
</template>

<script setup lang="ts">
import {
    ref as dbRef,
    query,
    orderByKey,
    startAfter,
    limitToFirst,
    get,
} from "firebase/database";
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
const allPostsLoaded = computed(() => {
    return postsStore.allPostsLoaded;
});
const maxPerPage = 6;
const { $db } = useNuxtApp();
const getPosts = async () => {
    if (allPostsLoaded.value) return; // 如果已載入所有文章，則返回
    isLoadingPosts.value = true;

    try {
        const postsRef = dbRef($db, "posts");
        let postsQuery;

        if (loadedPosts.value.length > 0) {
            const lastLoadedPostId =
                loadedPosts.value[loadedPosts.value.length - 1].id;
            postsQuery = query(
                postsRef,
                orderByKey(),
                startAfter(lastLoadedPostId),
                limitToFirst(maxPerPage)
            );
        } else {
            postsQuery = query(
                postsRef,
                orderByKey(),
                limitToFirst(maxPerPage)
            );
        }

        const snapshot = await get(postsQuery);
        const posts = snapshot.val();

        const hasSamePosts = Object.keys(posts).some((key) =>
            loadedPosts.value.some((post) => post.id === key)
        );
        if (posts && !hasSamePosts) {
            // 檢查loadedPosts是否已有此文章，避免重複載入
            const postsArray = Object.keys(posts).map((key) => ({
                id: key,
                ...posts[key],
            }));
            loadedPosts.value = [...loadedPosts.value, ...postsArray];
        }
    } catch (error) {
        console.error("Failed to load posts:", error);
    }
    setTimeout(() => {
        isLoadingPosts.value = false;
    }, 1000);
};

const handleScroll = async (event: Event) => {
    const bottomOfWindow =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 10;

    if (bottomOfWindow && !allPostsLoaded.value) {
        await getPosts(); // 滾動到底部時載入更多文章
    }
};

onMounted(async () => {
    await postsStore.getAllPostsCount();
    await getPosts(); // 初次加載文章
    window.addEventListener("scroll", handleScroll, { passive: true }); // 綁定滾動事件
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll); // 移除滾動事件
});
watchEffect(() => {
    isLoadingPosts.value = false;
    if (allPostsLoaded.value && window) {
        window.removeEventListener("scroll", handleScroll);
    }
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
