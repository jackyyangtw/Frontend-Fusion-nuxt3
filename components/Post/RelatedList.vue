<template>
    <div class="post-related-list py-10" v-if="relatedPosts.length > 0">
        <h3 class="text-3xl font-bold text-green-500 dark:text-green-400">
            相關主題</h3
        >
        <ul>
            <li
                class="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 p-3 rounded-md mt-3"
                v-for="post in relatedPosts"
            >
                <ULink
                    :to="`/posts/${post.id}`"
                    class="text-primary-500 font-bold block"
                >
                    <UIcon
                        name="i-heroicons-link"
                        class="text-black dark:text-white"
                    />
                    <span class="text-lg mx-3">{{ post.title }}</span>
                    <PostBadge
                        v-for="tag in post.tags"
                        :classes="getTagData(tag)?.style ?? ''"
                        :badgeName="getTagData(tag)?.name ?? ''"
                        :key="tag"
                    />
                </ULink>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    relatedPosts: Post[];
}>();
const tagsStore = useTagsStore();
const { tags } = storeToRefs(tagsStore);
const getTagData = (tag: string) => {
    if (!tag) return;
    return tags.value.find((t) => t.name === tag);
};
</script>
