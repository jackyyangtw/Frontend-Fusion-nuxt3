<template>
    <teleport to="body">
        <div
            v-if="pageLoading"
            class="loader-container w-full h-full bg-black/80 fixed left-0 top-0 flex justify-center items-center z-50"
        >
            <div class="loader"></div>
        </div>
    </teleport>
</template>

<script setup lang="ts">
const uiStore = useUIStore();
const { pageLoading } = storeToRefs(uiStore);
</script>

<style scoped>
.loader {
    width: 50px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #e3aad6;
    transform-origin: top;
    display: grid;
    animation: l3-0 1s infinite linear;
}
.loader::before,
.loader::after {
    content: "";
    grid-area: 1/1;
    background: #f4dd51;
    border-radius: 50%;
    transform-origin: top;
    animation: inherit;
    animation-name: l3-1;
}
.loader::after {
    background: #f10c49;
    --s: 180deg;
}
@keyframes l3-0 {
    0%,
    20% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes l3-1 {
    50% {
        transform: rotate(var(--s, 90deg));
    }
    100% {
        transform: rotate(0);
    }
}
</style>
