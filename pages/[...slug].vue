<template>
    <div
        style="
            background-image: linear-gradient(
                135deg,
                #0ea5e9 35%,
                #3b82f6 100%
            );
        "
        class="flex min-h-screen items-center text-white"
    >
        <div class="mx-auto flex flex-wrap items-center p-4">
            <div class="w-full p-4 text-center lg:w-1/2">
                <div class="text-[12rem] font-semibold">404</div>
            </div>
            <div class="w-full p-4 text-center lg:w-1/2 lg:text-left">
                <div class="mb-4 text-3xl font-medium"
                    >噢不！找不到這個頁面 😮</div
                >
                <div class="mb-8 text-lg"
                    >您可能輸入了錯誤的網址或頁面已被刪除。</div
                >
                <NuxtLink
                    to="/"
                    class="rounded border border-white px-4 py-2 hover:bg-gray-50 hover:bg-opacity-10 active:bg-opacity-20"
                    >回首頁</NuxtLink
                >
            </div>
        </div>
    </div>
</template>
