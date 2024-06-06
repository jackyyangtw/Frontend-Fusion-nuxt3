<template>
    <Teleport to="body">
        <Transition v-show="isLoading">
            <div
                class="fixed flex items-center justify-center w-full h-[120px] left-0 bottom-0 z-20 bg-gradient-to-t from-black/40 to-black/0"
            >
                <div class="loader-container">
                    <div class="loader"></div>
                </div>
            </div>
        </Transition>
    </Teleport>
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
    width: 75px; /* 根據你的需求調整寬度 */
    height: 75px; /* 根據你的需求調整高度 */
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

.v-enter-active,
.v-leave-active {
    transition: 0.5s;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateY(50px);
}
</style>
