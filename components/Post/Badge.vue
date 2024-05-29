<template>
    <span :class="[`badge-style`, classes]">{{ badgeName }}</span>
</template>

<script setup lang="ts">
defineProps<{
    classes: string;
    badgeName: string;
}>();
</script>

<style scoped>
.badge-style {
    @apply text-black dark:text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded;
}
</style>
