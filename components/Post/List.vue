<template>
    <section
        class="w-full pt-0 lg:pt-6 p-6 flex flex-wrap items-center justify-start container mx-auto relative z-10"
    >
        <PostPreviewSkeleton
            v-for="i in skeletonCount"
            :key="i"
            v-show="isLoadingPosts"
        />
        <post-preview
            v-show="!isLoadingPosts"
            v-for="(post, index) in posts"
            :is-admin="isAdmin"
            :key="post.id"
            :id="post.id"
            :title="post.title"
            :previewText="post.previewText"
            :thumbnail="post.thumbnail"
            :tags="post.tags"
            :previewImgUrl="post.previewImgUrl"
            :updatedDate="post.updatedDate"
            :index="index"
            :photoURL="post.photoURL"
            :author="post.author"
        >
        </post-preview>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    isAdmin: boolean;
    posts: Post[];
    skeletonCount: number;
}>();

const postsStore = usePostsStore();
const { isLoadingPosts } = storeToRefs(postsStore);
</script>
