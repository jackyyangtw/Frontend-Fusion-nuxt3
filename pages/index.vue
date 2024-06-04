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
            <PostList
                :posts="loadedPosts"
                :isAdmin="false"
                :skeletonCount="skeletonCount"
            ></PostList>
        </div>
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

const maxPerPage = 6;
const { $db } = useNuxtApp();
const totalPostsCount = ref(0);
const allPostsLoaded = ref(false);
const skeletonCount = ref(maxPerPage);
const getTotalPostsCount = async () => {
    const postsRef = dbRef($db, "posts");
    const snapshot = await get(postsRef);
    const posts = snapshot.val();
    if (posts) {
        totalPostsCount.value = Object.keys(posts).length;
    }
};
const getPosts = async () => {
    if (isLoadingPosts.value && loadedPosts.value.length > 0) return; // 初次加載時允許進行加載，但後續需判斷
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

        // 設定 skeletonCount 為正在載入的文章數量
        skeletonCount.value = maxPerPage;

        const snapshot = await get(postsQuery);
        const posts = snapshot.val();

        if (posts) {
            const postsArray = Object.keys(posts).map((key) => ({
                id: key,
                ...posts[key],
            }));

            loadedPosts.value = [...loadedPosts.value, ...postsArray];

            if (loadedPosts.value.length >= totalPostsCount.value) {
                allPostsLoaded.value = true;
            }
        } else {
            allPostsLoaded.value = true;
        }
    } catch (error) {
        console.error("Failed to load posts:", error);
    } finally {
        isLoadingPosts.value = false; // 加載完成後設置為 false
        skeletonCount.value = 0; // 加載完成後設置 skeletonCount 為 0
    }
};
const handleScroll = async (event: Event) => {
    const bottomOfWindow =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 10;

    if (bottomOfWindow && !allPostsLoaded.value) {
        console.log("Scrolled to bottom, loading more posts...");
        await getPosts(); // 滾動到底部時載入更多文章
    }
};

onMounted(async () => {
    await getTotalPostsCount();
    await getPosts(); // 初次加載文章
    window.addEventListener("scroll", handleScroll); // 綁定滾動事件
});

onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll); // 移除滾動事件
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
