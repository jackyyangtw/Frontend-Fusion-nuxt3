<template>
    <div class="admin-page container mx-auto">
        <UserCard v-if="user" :loadingCard="loadingCard" />

        <section class="pt-8">
            <h2
                class="text-center text-blue-400 dark:text-primary-400 text-3xl font-bold"
            >
                {{ userPosts.length > 0 ? "現有的文章" : "目前沒有文章" }}
            </h2>
            <PostList isAdmin :posts="userPosts"></PostList>
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
await userStore.getUserData();
const { user, firebaseUser } = storeToRefs(userStore);
const postsStore = usePostsStore();
const { loadedPosts, isLoadingPosts } = storeToRefs(postsStore);
const userPosts = computed(() => {
    return loadedPosts.value.filter(
        (post: Post) => post.userId === firebaseUser.value?.uid
    );
});
onMounted(() => {
    if (loadedPosts.value.length > 0) {
        isLoadingPosts.value = false;
    }
});
</script>

<style scoped></style>
