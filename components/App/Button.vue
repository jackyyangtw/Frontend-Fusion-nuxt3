<template>
    <button
        class="text-white text-base font-medium rounded-lg px-5 py-2.5 focus:ring-4 focus:outline-none"
        :class="btnStyle"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    btnStyle?: string;
}>();
const btnStyle = computed(() => {
    if (props.btnStyle === "main") {
        return "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800";
    } else if (props.btnStyle === "secondary") {
        return "bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-300 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus:ring-emerald-900";
    } else if (props.btnStyle === "danger") {
        return "bg-red-700 hover:bg-red-800 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900";
    }
});
</script>
