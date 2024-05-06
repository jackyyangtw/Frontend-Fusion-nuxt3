// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
    app: {
        head: {
            title: "Frontend Fusion", // 從你的 package.json 中替換
            meta: [
                { charset: "utf-8" },
                {
                    name: "viewport",
                    content: "width=device-width, initial-scale=1",
                },
                {
                    hid: "description",
                    name: "description",
                    content: "your-package-description",
                }, // 替換
                {
                    "http-equiv": "Cross-Origin-Opener-Policy",
                    content: "same-origin",
                },
                {
                    "http-equiv": "Cross-Origin-Embedder-Policy",
                    content: "require-corp",
                },
            ],
            link: [
                {
                    rel: "icon",
                    type: "image/x-icon",
                    href: "/images/site-icon.svg",
                },
                {
                    rel: "stylesheet",
                    href: "https://fonts.googleapis.com/css?family=Open+Sans",
                },
            ],
            htmlAttrs: {
                lang: "zh-Hant",
            },
        },
    },
    runtimeConfig: {
        public: {
            firebaseBaseUrl: process.env.FIREBASE_BASE_URL,
        },
    },
    imports: {
        dirs: ["types"],
    },
    // typescript: {
    //     typeCheck: true,
    // },
});
