// import { config } from "firebase-functions/lib/v1";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/color-mode",
        "@vueuse/nuxt",
        "nuxt-schema-org",
        "nuxt-vuefire",
    ],
    colorMode: {
        classSuffix: "",
        preference: "light",
        fallback: "light",
    },
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
                    type: "image/svg+xml",
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
        pageTransition: { name: "layout", mode: "out-in" },
    },
    runtimeConfig: {
        public: {
            firebaseBaseUrl: process.env.FIREBASE_BASE_URL,
            firebaseApiKey: process.env.FIREBASE_API_KEY,
        },
    },
    imports: {
        dirs: ["types/*"],
        autoImport: true,
    },
    // typescript: {
    //     typeCheck: true,
    // },
});
