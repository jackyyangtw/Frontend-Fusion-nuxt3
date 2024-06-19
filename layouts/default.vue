<template>
    <NuxtLoadingIndicator />
    <AppHeader />

    <div
        class="min-h-screen w-full relative z-10"
        :style="{
            paddingTop: headerHeight + 'px',
        }"
    >
        <slot
    /></div>
    <UIAuroraBg />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

const uiStore = useUIStore();
const { headerHeight } = storeToRefs(uiStore);
</script>

<style scoped></style>
