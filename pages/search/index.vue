<template>
    <div class="search-page container mx-auto pt-5">
        <h3
            class="text-center text-2xl font-bold text-primary-700 dark:text-primary-300"
        >
            <span v-if="searchedPosts.length > 0"
                >關鍵字: {{ searchQuery }} ({{ searchedPosts.length }})</span
            >
            <span v-else>沒有符合的結果</span>
        </h3>
        <PostList :posts="searchedPosts" :isAdmin="false"></PostList>
    </div>
</template>

<script setup lang="ts">
const postsStore = usePostsStore();
const { loadedPosts } = storeToRefs(postsStore);

const route = useRoute();
const searchQuery = computed(() => route.query.search_query as string);

const uiStore = useUIStore();
const { pageLoading } = storeToRefs(uiStore);
watchEffect(() => {
    useHead({
        title: searchQuery.value ?? "Search",
    });
    if (searchQuery.value) {
        pageLoading.value = false;
    }
});
const searchedPosts = computed(() => {
    if (!searchQuery.value) return loadedPosts.value;

    const searchWords = searchQuery.value.toLowerCase().split(" ");

    return loadedPosts.value.filter((post) => {
        const lowerTitle = post.title.toLowerCase();
        const lowerContent = post.content.toLowerCase();
        const lowerPreviewText = post.previewText.toLowerCase();
        const lowerTags = post.tags.join(" ").toLowerCase();
        return searchWords.every(
            (word) =>
                lowerTitle.includes(word) ||
                lowerContent.includes(word) ||
                lowerPreviewText.includes(word) ||
                lowerTags.includes(word)
        );
    });
});

const searchStore = useSearchStore();
const { searchText } = storeToRefs(searchStore);
onBeforeRouteLeave(() => {
    searchText.value = "";
});
</script>

<style scoped></style>
