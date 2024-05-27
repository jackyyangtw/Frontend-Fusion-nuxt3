<template>
    <div class="admin-post-new-page">
        <section class="update-form">
            <AdminPostForm :post="post" newPost></AdminPostForm>
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
    author: user.value?.name,
    id: "",
    thumbnail: "",
    tags: [],
    updatedDate: "",
    photoURL: "",
    userId: "",
});
</script>
