<template>
    <NuxtLoadingIndicator />
    <AppHeader />
    <AppSideNav />
    <div
        class="min-h-screen w-full relative z-10"
        :style="{
            paddingTop: at404Route ? 0 : headerHeight + 'px',
        }"
    >
        <slot />
    </div>
    <UIAuroraBg />
    <LoadingPage v-if="!at404Route" />
    <LoadingApp v-if="!at404Route" />
    <AppFooter />
</template>

<script setup lang="ts">
const uiStore = useUIStore();
const { headerHeight } = storeToRefs(uiStore);
const route = useRoute();
const atAdminRoute = computed(() => route.path.includes("/admin"));
const atSearchRoute = computed(() => route.path.includes("/search"));
const at404Route = computed(() => route.name === "slug");
watchEffect(() => {
    if (atAdminRoute.value || atSearchRoute.value || at404Route.value) {
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
