<template>
    <component
        :is="componentType"
        class="text-white text-base font-medium rounded-lg px-5 py-2.5 focus:ring-4 focus:outline-none"
        :class="[btnStyle, customStyle, disabledStyle]"
        :to="isRouterLink ? to : undefined"
        :disabled="disabled"
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
    disabled: {
        type: Boolean,
        default: false,
    },
});

const getBtnStyle = (color: string) => {
    return props.disabled ? `bg-${color}-700 focus:ring-${color}-300 dark:bg-${color}-600 dark:focus:ring-${color}-800` : `bg-${color}-500 hover:bg-${color}-600 focus:ring-${color}-300 dark:bg-${color}-600 dark:hover:bg-${color}-700 dark:focus:ring-${color}-800`;
};

const disabledStyle = computed(() => {
    return props.disabled ? "opacity-50 cursor-not-allowed" : "";
});

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
