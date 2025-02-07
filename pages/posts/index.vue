<template>
    <div class="xl:flex items-start lg:ml-[8rem]">
        <div class="sidebar-placeholder w-32 hidden xl:block h:10"></div>
        <LazyPostFilter
            :posts="sortedPosts"
            :selectedTag="selectedTag"
            @setFilter="setFilter"
        />
        <LazyPostList :posts="filteredPosts" :isAdmin="false" />
        <LazyLoadingLists :isLoading="isLoadingPosts" />
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "文章列表",
});

const selectedTag = ref<string>("全部類型");

const postsStore = usePostsStore();
postsStore.getRestPosts();

const { sortedPosts, isLoadingPosts } = storeToRefs(postsStore);
const filteredPosts = shallowRef(sortedPosts.value);
watch([sortedPosts, selectedTag], () => {
    if (selectedTag.value === "全部類型") {
        filteredPosts.value = sortedPosts.value;
    } else {
        filteredPosts.value = sortedPosts.value.filter((post) =>
            post.tags.includes(selectedTag.value)
        );
    }
});

const setFilter = (tag: string) => {
    if (selectedTag.value !== tag) {
        selectedTag.value = tag;
    }
};
</script>
