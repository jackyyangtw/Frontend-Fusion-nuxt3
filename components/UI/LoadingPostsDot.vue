<template>
    <transition name="fadeUp" v-if="isLoading">
        <div
            class="loader-container fixed left-[50%] bottom-[10%] translate-x-[-50%] z-20"
        >
            <div class="loader"></div>
        </div>
    </transition>
</template>

<script setup lang="ts">
const props = defineProps<{
    isLoading: boolean;
}>();
</script>

<style scoped>
.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px; /* 根據你的需求調整寬度 */
    height: 80px; /* 根據你的需求調整高度 */
    border-radius: 50%;
    z-index: 15; /* 確保在 loader 後面 */
    @apply bg-slate-900;
}

.loader {
    color: white;
    width: 4px;
    aspect-ratio: 1;
    border-radius: 50%;
    box-shadow: 19px 0 0 7px, 38px 0 0 3px, 57px 0 0 0;
    transform: translateX(-38px);
    animation: l21 0.5s infinite alternate linear;
    z-index: 5;
}

@keyframes l21 {
    50% {
        box-shadow: 19px 0 0 3px, 38px 0 0 7px, 57px 0 0 3px;
    }
    100% {
        box-shadow: 19px 0 0 0, 38px 0 0 3px, 57px 0 0 7px;
    }
}
</style>
