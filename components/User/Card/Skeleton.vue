<template>
    <div
        class="w-full mt-5 max-w-lg mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
    >
        <div class="flex flex-col items-center py-10">
            <div class="overflow-hidden">
                <div
                    class="w-24 h-24 mb-3 rounded-full bg-gray-400 animate-pulse"
                ></div>
            </div>
            <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                <div class="text"></div>
            </h5>
            <div class="flex mt-4 space-x-3 md:mt-6">
                <div class="text"></div>
                <div class="text"></div>
                <div class="text"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.text {
    @apply w-24 h-6 mb-3 rounded-full bg-gray-400 animate-pulse;
}
</style>
