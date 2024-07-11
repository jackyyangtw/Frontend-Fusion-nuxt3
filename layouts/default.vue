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
const route = useRoute();
const atAdminRoute = computed(() => route.path.includes("/admin"));
const atSearchRoute = computed(() => route.path.includes("/search"));
watchEffect(() => {
    if(atAdminRoute.value || atSearchRoute.value){
        useHead({
            meta: [
                {
                    hid: "robots",
                    name: "robots",
                    content: "noindex",
                },
            ],
        });
    } else {
        useHead({
            meta: [
                {
                    hid: "robots",
                    name: "robots",
                    content: "index",
                },
            ],
        });
    }
});
</script>
