<template>
    <div class="flex min-h-screen items-center text-white">
        <div class="mx-auto flex flex-col lg:flex-row gap-10 items-center p-4">
            <figure class="max-w-[500px] rounded-xl overflow-hidden shadow-xl">
                <img src="/public/images/404_page.png" alt="" />
            </figure>
            <div class="w-full p-4 text-center lg:w-1/2 lg:text-left">
                <div
                    class="text-black dark:text-white mb-4 text-3xl font-medium"
                    >噢不！找不到這個頁面 😮</div
                >
                <div class="mb-8 text-lg text-black dark:text-white"
                    >您可能輸入了錯誤的網址或頁面已被刪除。</div
                >
                <NuxtLink
                    to="/"
                    class="text-black dark:text-white rounded border border-black dark:border-white px-4 py-2 hover:bg-gray-50 hover:bg-opacity-10 active:bg-opacity-20"
                    >回首頁</NuxtLink
                >
            </div>
        </div>
    </div>
</template>
