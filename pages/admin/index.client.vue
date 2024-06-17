<template>
    <div class="admin-page container mx-auto">
        <LazyUserCard v-if="user" :loadingCard="loadingCard" />

        <section class="pt-8">
            <h2
                class="text-center text-blue-400 dark:text-primary-400 text-3xl font-bold"
            >
                {{ userPosts.length > 0 ? "現有的文章" : "目前沒有文章" }}
            </h2>
            <LazyPostList
                v-if="userPosts.length > 0"
                isAdmin
                :posts="userPosts"
            ></LazyPostList>
        </section>
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "管理員頁面",
    meta: [
        {
            name: "description",
            content: "這是管理員頁面，您可以在這裡管理您的文章",
        },
    ],
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
const { getAllUserPostsCount, getUserPosts } = postsStore;
const allUserPostsLoaded = computed(() => postsStore.allUserPostsLoaded);
if (!allUserPostsLoaded.value) {
    await getAllUserPostsCount();
    await getUserPosts();
}
</script>
