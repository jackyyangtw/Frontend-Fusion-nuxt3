<template>
    <div class="admin-page container mx-auto">
        <LazyUserCard v-if="user" :loadingCard="loadingCard" />

        <section class="pt-8">
            <h2
                class="text-center text-blue-400 dark:text-primary-400 text-3xl font-bold"
            >
                {{ userPosts.length > 0 ? "現有的文章" : "目前沒有文章" }}
            </h2>
            <RenderCacheable>
                <LazyPostList
                    v-if="userPosts.length > 0"
                    isAdmin
                    :posts="userPosts"
                ></LazyPostList>
            </RenderCacheable>
        </section>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "管理員頁面",
});
const loadingCard = ref(false);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const { getUserData } = userStore;
if (!user.value) {
    loadingCard.value = true;
    await getUserData();
    loadingCard.value = false;
}

const postsStore = usePostsStore();
const { userPosts } = storeToRefs(postsStore);
const allUserPostsLoaded = computed(() => postsStore.allUserPostsLoaded);
</script>
