<template>
    <div class="admin-post-page">
        <AppToast
            :showToast="toast.showToast"
            :message="toast.message"
            :type="toast.messageType"
        />
        <section class="update-form">
            <admin-post-form
                v-if="loadedPost"
                :post="loadedPost"
            ></admin-post-form>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref as dbRef } from "firebase/database";
const { $db } = useNuxtApp();
const route = useRoute();
const loadedPost = useDatabaseObject<Post>(
    dbRef($db, `posts/${route.params.postId}`)
);
useHeadSafe({
    title: "編輯文章",
});

const uiStore = useUIStore();
const { toast } = storeToRefs(uiStore);
</script>

<style lang="scss" scoped></style>
