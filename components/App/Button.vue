<template>
    <component
        :is="componentType"
        class="text-white text-base font-medium rounded-lg px-5 py-2.5 focus:ring-4 focus:outline-none"
        :class="[btnStyle, customStyle]"
        :to="isRouterLink ? to : undefined"
    >
        <slot />
    </component>
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
    to: {
        type: String,
        default: "",
    },
    customStyle: {
        type: String,
        default: "",
    },
});

const getBtnStyle = (color: string) => {
    return `bg-${color}-700 hover:bg-${color}-800 focus:ring-${color}-300 dark:bg-${color}-600 dark:hover:bg-${color}-700 dark:focus:ring-${color}-800`;
};

const btnStyle = computed(() => {
    if (props.btnStyle === "primary") {
        return getBtnStyle("blue");
    } else if (props.btnStyle === "secondary") {
        return getBtnStyle("emerald");
    } else if (props.btnStyle === "danger") {
        return getBtnStyle("red");
    }
});

const componentType = computed(() => {
    return props.isRouterLink ? resolveComponent("nuxt-link") : "button";
});
</script>
