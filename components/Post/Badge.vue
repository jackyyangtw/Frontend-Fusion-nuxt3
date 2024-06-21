<template>
    <component
        :is="component"
        :class="[`badge-style`, classes]"
        v-bind="atPostPage ? { to: `/search/?search_query=${badgeName}` } : {}"
    >
        {{ badgeName }}
    </component>
</template>

<script setup lang="ts">
defineProps<{
    classes: string;
    badgeName: string;
}>();

const route = useRoute();
const atPostPage = computed(() => {
    return route.name === "posts-id";
});
const component = computed(() => {
    return route.name === "posts-id" ? resolveComponent("NuxtLink") : "span";
});
</script>

<style scoped>
.badge-style {
    @apply text-black dark:text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded;
}
</style>
