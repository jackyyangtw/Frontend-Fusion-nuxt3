/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        `components/**/*.{vue,js}`,
        `layouts/**/*.vue`,
        `pages/**/*.vue`,
        `composables/**/*.{js,ts}`,
        `plugins/**/*.{js,ts}`,
        `App.{js,ts,vue}`,
        `app.{js,ts,vue}`,
    ],
    darkMode: "class",
    theme: {},
    plugins: [],
    safelist: [
        // 為每個 color 提供樣式範圍
        {
            pattern: /(bg|ring)-(.*)-(600|700|800)/,
            variants: [
                "dark:hover",
                "dark:focus",
                "dark",
                "hover",
                "responsive",
                "focus",
            ],
        },
    ],
};
