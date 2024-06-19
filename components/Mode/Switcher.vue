<template>
    <div class="px-3">
        <div class="w-6 h-6 cursor-pointer" @click="toggleTheme">
            <!-- moon -->
            <svg
                v-show="colorMode.value === 'dark'"
                fill="white"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M7.455 2.004a.75.75 0 01.26.77 7 7 0 009.958 7.967.75.75 0 011.067.853A8.5 8.5 0 116.647 1.921a.75.75 0 01.808.083z"
                ></path>
            </svg>
            <!-- sun -->
            <svg
                v-show="colorMode.value === 'light'"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                class="stroke-slate-700 dark:stroke-slate-700"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                ></path>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();
const toggleTheme = () => {
    colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};
</script>
