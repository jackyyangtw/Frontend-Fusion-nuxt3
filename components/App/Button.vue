<template>
    <Component
        class="text-white text-base font-medium rounded-lg px-5 py-2.5 focus:ring-4 focus:outline-none"
        :class="btnStyle"
        :is="isRouterLink ? 'nuxt-link' : 'button'"
    >
        <slot />
    </Component>
</template>

<script setup lang="ts">
const props = defineProps({
    btnStyle: {
        type: String,
    },
    isRouterLink: {
        type: Boolean,
        default: false,
    },
});

const getBtnStyle = (color: string) => {
    return `bg-${color}-700 hover:bg-${color}-800 focus:ring-${color}-300 dark:bg-${color}-600 dark:hover:bg-${color}-700 dark:focus:ring-${color}-800`;
};
const btnStyle = computed(() => {
    if (props.btnStyle === "main") {
        return getBtnStyle("blue");
    } else if (props.btnStyle === "secondary") {
        return getBtnStyle("emerald");
    } else if (props.btnStyle === "danger") {
        return getBtnStyle("red");
    }
});
</script>
