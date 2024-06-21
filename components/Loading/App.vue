<template>
    <teleport to="body">
        <Transition name="fade">
            <div
                v-if="appLoading"
                class="fixed inset-0 flex items-center justify-center bg-black/90 z-50"
            >
                <div class="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </Transition>
    </teleport>
</template>

<script setup lang="ts">
const uiStore = useUIStore();
const { appLoading } = storeToRefs(uiStore);
</script>

<style scoped>
.spinner {
    width: 70.4px;
    height: 70.4px;
    animation: spinner 1.6s infinite ease;
    transform-style: preserve-3d;
}

.spinner > div {
    background-color: transparrent;
    height: 100%;
    position: absolute;
    width: 100%;
    /* border: 3.5px solid rgba(56, 189, 248); */
    border: 3.5px solid;
    border-image: linear-gradient(#0093e9, #80d0c7) 1;
}

.spinner div:nth-of-type(1) {
    transform: translateZ(-35.2px) rotateY(180deg);
}

.spinner div:nth-of-type(2) {
    transform: rotateY(-270deg) translateX(50%);
    transform-origin: top right;
}

.spinner div:nth-of-type(3) {
    transform: rotateY(270deg) translateX(-50%);
    transform-origin: center left;
}

.spinner div:nth-of-type(4) {
    transform: rotateX(90deg) translateY(-50%);
    transform-origin: top center;
}

.spinner div:nth-of-type(5) {
    transform: rotateX(-90deg) translateY(50%);
    transform-origin: bottom center;
}

.spinner div:nth-of-type(6) {
    transform: translateZ(35.2px);
}

@keyframes spinner {
    0% {
        transform: rotate(45deg) rotateX(-25deg) rotateY(25deg);
    }

    50% {
        transform: rotate(45deg) rotateX(-385deg) rotateY(25deg);
    }

    100% {
        transform: rotate(45deg) rotateX(-385deg) rotateY(385deg);
    }
}
</style>
