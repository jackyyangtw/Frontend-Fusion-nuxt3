<template>
    <div class="admin-post-page">
        <section class="update-form" v-if="loadedPost">
            <LazyAdminPostForm :post="loadedPost"></LazyAdminPostForm>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref as dbRef } from "firebase/database";
const { $db } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const userPostsRef = dbRef($db, `posts/${route.params.postId}`);
const { data: loadedPost } = useDatabaseObject<Post>(userPostsRef);
const localContent = useLocalStorage("editorContent", "") as Ref<string>;
watchEffect(() => {
    if (loadedPost.value === null) {
        router.push({ name: "slug" });
    }
});
useHead({
    title: loadedPost.value?.title ?? "無標題",
    titleTemplate: (title) => `管理文章 - ${title}`,
});
onMounted(() => {
    if (loadedPost.value && localContent.value) {
        loadedPost.value.content = localContent.value ?? "";
    }
});
</script>
