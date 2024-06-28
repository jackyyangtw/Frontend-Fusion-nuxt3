<template>
    <NuxtLoadingIndicator />
    <AppHeader />
    <AppSideNav />
    <div
        class="min-h-screen w-full relative z-10"
        :style="{
            paddingTop: headerHeight + 'px',
        }"
    >
        <slot />
    </div>
    <UIAuroraBg />
    <LoadingPage />
    <LoadingApp />
    <AppFooter />
</template>

<script setup lang="ts">
const uiStore = useUIStore();
const { headerHeight } = storeToRefs(uiStore);
</script>
