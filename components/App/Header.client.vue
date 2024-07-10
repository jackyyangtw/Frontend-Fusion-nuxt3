<template>
    <div
        class="h-[60px] fixed z-30 w-full bg-slate-100/[0.8] dark:bg-slate-950/[0.4]"
    >
        <div class="glass fixed-glass" ref="glassRef"></div>
        <header class="the-header" ref="theHeader">
            <LazyAppSideNavToggle />
            <nuxt-link
                to="/"
                class="logo hidden md:flex text-slate-700 dark:text-white"
            >
                <img
                    class="max-w-[30px] mr-3"
                    src="/images/site-icon-v2.svg"
                    alt="logo"
                    width="30"
                    height="30"
                />
                {{ siteName }}
            </nuxt-link>
            <SearchBar></SearchBar>
            <ModeSwitcher></ModeSwitcher>
            <div class="navigation-items">
                <ul class="nav-list">
                    <li
                        class="nav-item"
                        v-for="nav in filteredNavLinks"
                        :key="nav.to"
                    >
                        <nuxt-link
                            class="text-slate-700 dark:text-white"
                            :to="nav.to"
                            >{{ nav.title }}</nuxt-link
                        >
                    </li>
                </ul>
            </div>
        </header>
    </div>
</template>

<script setup lang="ts">
const navStore = useNavigationStore();
const { filteredNavLinks } = storeToRefs(navStore);
const { public: { siteName }} = useRuntimeConfig();
</script>

<style scoped>
.header-container {
    height: 60px;
}

.the-header {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
}

.logo {
    margin: 0 10px;
    font-size: 1.3rem;
}

.logo a {
    text-decoration: none;
}

.spacer {
    flex: 1;
}

.navigation-items {
    display: none;
}

@media (min-width: 768px) {
    .navigation-items {
        display: block;
    }
}

.nav-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
}

.nav-item {
    margin: 0 10px;
}

.nav-item a {
    text-decoration: none;
}

.nav-item a:hover,
.nav-item a:active,
.nav-item a.router-link-active {
    @apply font-bold text-primary-600 dark:text-primary-400;
}
</style>
