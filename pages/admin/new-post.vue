<template>
    <div class="admin-post-new-page">
        <section class="update-form">
            <LazyAdminPostForm :post="post" newPost></LazyAdminPostForm>
        </section>
    </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const post = ref<Post>({
    title: "",
    content: "",
    previewImgUrl: "",
    previewText: "",
    author: user.value?.name ?? "",
    id: "",
    thumbnail: "",
    tags: [],
    updatedDate: "",
    photoURL: "",
    userId: "",
});
const localContent = useLocalStorage("editorContent", "") as Ref<string>;
onMounted(() => {
    if (localContent.value) {
        post.value.content = localContent.value ?? "";
    }
});
useHead({
    title: `新增文章`,
});
</script>
