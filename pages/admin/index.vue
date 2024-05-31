<template>
    <div class="admin-page container mx-auto">
        <UserCard v-if="user" :loadingCard="loadingCard" />

        <section class="pt-8">
            <h2
                class="text-center text-blue-400 dark:text-primary-400 text-3xl font-bold"
            >
                {{ userPosts.length > 0 ? "現有的文章" : "目前沒有文章" }}
            </h2>
            <post-list
                isAdmin
                :posts="userPosts"
                :loadingPosts="loadingPosts"
            ></post-list>
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
const loadingPosts = ref(false);

const userStore = useUserStore();
await userStore.getUserData();
const { user, firebaseUser } = storeToRefs(userStore);
const isManager = computed(() => user.value?.isManager);
const postsStore = usePostsStore();
const { loadedPosts } = storeToRefs(postsStore);
const userPosts = computed(() => {
    return loadedPosts.value.filter(
        (post: Post) => post.userId === firebaseUser.value?.uid
    );
});

const uiStore = useUIStore();
const { toast } = storeToRefs(uiStore);
const updatePhoto = (Toast: Toast) => {
    if (Toast.showToast) {
        toast.value.showToast = true;
        toast.value.message = "更新頭像中...";
        toast.value.messageType = "loading";
    } else if (Toast.messageType === "error") {
        toast.value.message = Toast.message;
        toast.value.messageType = "error";
    } else if (!Toast.showToast) {
        setTimeout(() => {
            toast.value.message = "更新頭像成功!";
            toast.value.messageType = "success";
        }, 2000);
        setTimeout(() => {
            toast.value.showToast = false;
        }, 4000);
    }
};
</script>

<style scoped></style>
