<template>
    <!-- hamberger -->
    <div class="drawer-toggle" role="button" @click="toggleSideNav">
        <div class="bar"></div>
        <div class="bar"></div>
        <div class="bar"></div>
    </div>
</template>

<script setup lang="ts">
const uiStore = useUIStore();
const { isSidenavOpen } = storeToRefs(uiStore);
const toggleSideNav = () => {
    isSidenavOpen.value = !isSidenavOpen.value;
};
</script>

<style scoped>
.drawer-toggle {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 50%;
    width: 35px;
    cursor: pointer;
}

@media (min-width: 768px) {
    .drawer-toggle {
        display: none;
    }
}

.drawer-toggle .bar {
    width: 90%;
    height: 2px;
    @apply bg-black dark:bg-white;
}
</style>
