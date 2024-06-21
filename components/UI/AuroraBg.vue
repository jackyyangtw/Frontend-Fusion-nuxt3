<template>
    <div class="canvas-wrapper z-0">
        <div class="glass fixed-glass"></div>
        <div class="circle circle-0"></div>
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
    </div>
</template>

<style scoped>
@keyframes moveAround0 {
    0% {
        transform: translate(-40%, -30%);
    }
    50% {
        transform: translate(0%, 20%);
    }
    100% {
        transform: translate(-40%, -30%);
    }
}

@keyframes moveAround1 {
    0% {
        transform: translate(-70%, -70%);
    }
    50% {
        transform: translate(-40%, -40%);
    }
    100% {
        transform: translate(-70%, -70%);
    }
}

@keyframes moveAround2 {
    0% {
        transform: translate(30%, -80%);
    }
    50% {
        transform: translate(-30%, -50%);
    }
    100% {
        transform: translate(30%, -80%);
    }
}

@keyframes moveAround3 {
    0% {
        transform: translate(-25%, 0%);
    }
    50% {
        transform: translate(-76%, -45%);
    }
    100% {
        transform: translate(-25%, 0%);
    }
}

.canvas-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    opacity: 0.4;
    overflow: hidden;
    /* backdrop-filter: blur(10px); */
}
/* .glass {
    background: transparent;
    backdrop-filter: blur(10px);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    border-bottom: solid 1px rgba(255, 255, 255, 0.1);
} */
.canvas-wrapper .aurora-wrapper {
    width: 100%;
    height: 100%;
    background: rgba(194, 194, 194, 0.131);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.canvas-wrapper .circle {
    width: 150%;
    aspect-ratio: 0.8;
    margin: 0px auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
}

.canvas-wrapper .circle.circle-0 {
    background: radial-gradient(ellipse, #6689e8, transparent, transparent);
    animation: moveAround0 16s ease-in-out infinite;
}

.canvas-wrapper .circle.circle-1 {
    background: radial-gradient(ellipse, #84ffa7, transparent, transparent);
    animation: moveAround1 16s ease-in-out infinite;
}

.canvas-wrapper .circle.circle-2 {
    background: radial-gradient(ellipse, #d5638a, transparent, transparent);
    animation: moveAround2 16s ease-in-out infinite;
}

.canvas-wrapper .circle.circle-3 {
    background: radial-gradient(ellipse, #817ced, transparent, transparent);
    animation: moveAround3 16s ease-in-out infinite;
}
</style>
