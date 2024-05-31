<template>
    <div class="xl:flex items-start ml-[8rem]">
        <div class="sidebar-placeholder w-32 hidden xl:block h:10" ref=""></div>
        <PostFilter
            :posts="loadedPosts"
            :selectedTag="selectedTag"
            @setFilter="setFilter"
        />
        <PostList
            :posts="filteredPosts"
            :isAdmin="false"
            :loadingPosts="false"
        />
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "文章列表",
});

const selectedTag = ref<string>("全部類型");

const postsStore = usePostsStore();
const { loadedPosts } = storeToRefs(postsStore);

const filteredPosts = computed(() => {
    if (selectedTag.value === "全部類型") {
        return loadedPosts.value;
    }
    return loadedPosts.value.filter((post) =>
        post.tags.includes(selectedTag.value)
    );
});

const setFilter = (tag: string) => {
    if (selectedTag.value !== tag) {
        selectedTag.value = tag;
    }
};
</script>

<style scoped></style>
