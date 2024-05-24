<template>
    <div class="admin-post-page">
        <section class="update-form" v-if="loadedPost">
            <AdminPostForm :post="loadedPost"></AdminPostForm>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref as dbRef } from "firebase/database";
const { $db } = useNuxtApp();
const route = useRoute();
const { data: loadedPost } = useDatabaseObject<Post>(
    dbRef($db, `posts/${route.params.postId}`)
);
watch(
    loadedPost,
    (newVal) => {
        if (newVal) {
            useHead({
                title: `編輯文章 - ${newVal.title || "無標題"}`,
            });
        } else {
            useHead({
                title: "載入中...",
            });
        }
    },
    { immediate: true }
);
</script>
