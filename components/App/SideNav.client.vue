<template>
    <teleport to="body">
        <div class="sidenav-container fixed left-0 top-0 z-[60]">
            <div
                v-if="isSidenavOpen"
                class="sidenav-backdrop fixed left-0 top-0 w-full h-full bg-black/50 z-[70]"
                @click="closeSidenav"
            ></div>
            <transition name="slideRight">
                <div
                    v-if="isSidenavOpen"
                    class="sidenav fixed p-5 left-0 top-0 w-1/2 h-full z-[80] bg-black/90"
                >
                    <ul
                        class="nav-list flex flex-col gap-5"
                        @click="closeSidenav"
                    >
                        <li>
                            <img
                                class="max-w-[60px]"
                                src="/images/site-icon-v2.svg"
                                alt="logo"
                            />
                        </li>
                        <li class="nav-item">
                            <nuxt-link to="/">Fronted Fusion</nuxt-link>
                        </li>
                        <li class="nav-item" v-for="nav in filteredNavLinks">
                            <nuxt-link :to="nav.to">{{ nav.title }}</nuxt-link>
                        </li>
                    </ul>
                </div>
            </transition>
        </div>
    </teleport>
</template>

<script setup lang="ts">
const navStore = useNavigationStore();
const { filteredNavLinks } = storeToRefs(navStore);

const uiStore = useUIStore();
const { isSidenavOpen } = storeToRefs(uiStore);
const closeSidenav = () => {
    isSidenavOpen.value = false;
};
</script>

<style scoped>
.nav-item {
    @apply text-white text-xl;
}
.slideRight-enter-active,
.slideRight-leave-active {
    transition: all 0.3s ease-out;
}

.slideRight-enter-from,
.slideRight-leave-to {
    transform: translateX(-100px);
    opacity: 0;
}
</style>
