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
        <LazyPostList :posts="searchedPosts" :isAdmin="false"></LazyPostList>
    </div>
</template>

<script setup lang="ts">
const postsStore = usePostsStore();
const { sortedPosts, loadedPosts, isLoadingPosts, allPosts } =
    storeToRefs(postsStore);

const route = useRoute();
const searchQuery = computed(() => route.query.search_query as string);

const uiStore = useUIStore();
const { pageLoading } = storeToRefs(uiStore);

const setHead = () => {
    if (searchQuery.value) {
        useHead({
            titleTemplate: () => {
                return `搜尋 - ${searchQuery.value}`;
            },
        });
    } else {
        useHead({
            title: "搜尋",
        });
    }
};
setHead();

watchEffect(() => {
    setHead();
    if (searchQuery.value) {
        pageLoading.value = false;
    }
});
const searchedPosts = computed(() => {
    if (!searchQuery.value) return sortedPosts.value;

    const searchWords = searchQuery.value.toLowerCase().split(" ");

    return sortedPosts.value.filter((post) => {
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
// const { getRestPosts } = postsStore;
// onMounted(async () => {
//     await getRestPosts();
// });
loadedPosts.value = allPosts.value;
isLoadingPosts.value = false;
</script>

<style scoped></style>
