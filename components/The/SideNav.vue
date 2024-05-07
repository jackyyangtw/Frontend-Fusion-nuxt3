<template>
    <div class="sidenav-container">
        <div v-if="show" class="sidenav-backdrop" @click="$emit('close')"></div>
        <transition name="slide-side">
            <div v-if="show" class="sidenav">
                <ul class="nav-list" @click="$emit('close')">
                    <li>
                        <img
                            class="max-w-[60px]"
                            src="/images/site-icon.svg"
                            alt="logo"
                        />
                    </li>
                    <li class="nav-item">
                        <nuxt-link to="/">Fronted Fusion</nuxt-link>
                    </li>
                    <li class="nav-item" v-for="nav in navLinks">
                        <nuxt-link :to="nav.to">{{ nav.title }}</nuxt-link>
                    </li>
                </ul>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
const navStore = useNavigationStore();
const navLinks = navStore.navLinks;
defineProps({
    show: Boolean,
});
</script>

<style scoped></style>
