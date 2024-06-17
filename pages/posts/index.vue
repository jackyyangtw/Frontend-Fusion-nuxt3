<template>
    <div class="xl:flex items-start ml-[8rem]">
        <div class="sidebar-placeholder w-32 hidden xl:block h:10" ref=""></div>
        <LazyPostFilter
            :posts="loadedPosts"
            :selectedTag="selectedTag"
            @setFilter="setFilter"
        />
        <LazyPostList :posts="filteredPosts" :isAdmin="false" />
    </div>
</template>

<script setup lang="ts">
useHead({
    title: "文章列表",
});

const selectedTag = ref<string>("全部類型");

const postsStore = usePostsStore();
const { loadedPosts } = storeToRefs(postsStore);
const filteredPosts = shallowRef(loadedPosts.value);
watch([loadedPosts, selectedTag], () => {
    if (selectedTag.value === "全部類型") {
        filteredPosts.value = loadedPosts.value;
    } else {
        filteredPosts.value = loadedPosts.value.filter((post) =>
            post.tags.includes(selectedTag.value)
        );
    }
});

const setFilter = (tag: string) => {
    if (selectedTag.value !== tag) {
        selectedTag.value = tag;
    }
};

const allPostsLoaded = computed(() => {
    return postsStore.allPostsLoaded;
});

await postsStore.getAllPostsCount();
if (!allPostsLoaded.value) {
    await postsStore.getAllPosts();
}
</script>
