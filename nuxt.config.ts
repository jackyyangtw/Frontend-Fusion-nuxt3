// nuxt.config.ts

// https://nuxt.com/docs/api/configuration/nuxt-config
const isDev = process.env.NODE_ENV === "development";
const siteName = "Frontend Fusion";
// const firebaseStorageUrl = isDev
//     ? "https://firebasestorage.googleapis.com/v0/b/frontend-fusion-test.appspot.com/o/"
//     : "https://firebasestorage.googleapis.com/v0/b/nuxt-blog-b5610.appspot.com/o/";
// const firebaseStorageUrl = "https://firebasestorage.googleapis.com/";
const vueFireConfig = {
    apiKey: isDev
        ? process.env.DEV_FIREBASE_API_KEY
        : process.env.FIREBASE_API_KEY,
    authDomain: isDev
        ? process.env.DEV_FIREBASE_AUTH_DOMAIN
        : process.env.FIREBASE_AUTH_DOMAIN,
    projectId: isDev
        ? process.env.DEV_FIREBASE_PROJECT_ID
        : process.env.FIREBASE_PROJECT_ID,
    storageBucket: isDev
        ? process.env.DEV_FIREBASE_STORAGE_BUCKET
        : process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: isDev
        ? process.env.DEV_FIREBASE_MESSAGING_SENDER_ID
        : process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: isDev
        ? process.env.DEV_FIREBASE_APP_ID
        : process.env.FIREBASE_APP_ID,
    measurementId: isDev
        ? process.env.DEV_FIREBASE_MEASUREMENT_ID
        : process.env.FIREBASE_MEASUREMENT_ID,
};
export default defineNuxtConfig({
    build: {
        analyze: true,
    },
    devtools: { enabled: true },
    modules: [
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "nuxt-vuefire",
        "@nuxt/ui",
        "nuxt-tiptap-editor",
        "@nuxt/image",
        "nuxt-multi-cache",
        "nuxt-schema-org",
        "@nuxtjs/sitemap",
        "@nuxtjs/robots",
    ],

    robots: {
        // provide simple disallow rules for all robots `user-agent: *`
        disallow: ["/admin", "/auth", "/search"],
        allow: ["/posts", "/"],
    },
    sitemap: {
        sources: ["/api/_sitemap_/urls"],
        exclude: ["/admin/**", "/auth/**", "/search/**"],
    },
    site: {
        url: "https://frontend-fusion.com",
    },

    multiCache: {
        component: {
            enabled: true,
            // maxAge: 1000 * 60 * 15,
        },
        data: {
            enabled: true,
            // maxAge: 1000 * 60 * 30, // 也增加資料快取時間
        },
    },
    tiptap: {
        prefix: "Tiptap", //prefix for Tiptap imports, composables not included
        lowlight: {
            // list https://github.com/modbender/nuxt-tiptap-editor/blob/7dfbe1c213af472f8f7a50b0e3dd5a7dd8552ce9/src/types.d.ts#L3
            theme: "github-dark",
        },
    },
    vuefire: {
        config: vueFireConfig,
        auth: {
            enabled: true,
            persistence: ["indexedDBLocal"],
        },
    },
    app: {
        head: {
            title: siteName, // 從你的 package.json 中替換
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
                    href: "/images/site-icon-v2.svg",
                },
                {
                    rel: "stlyesheet",
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
            firebaseRealtimeDbBaseUrl: process.env.FIREBASE_REALTIME_BASE_URL,
            firebaseApiKey: process.env.FIREBASE_API_KEY,
            siteName,
        },
        vueFireConfig,
    },
    imports: {
        dirs: ["types/client/*.ts"],
        autoImport: true,
    },
    ui: {
        // icons: ["la"],
        safelistColors: [
            "sky",
            "cyan",
            "green",
            "gray",
            "blue",
            "yellow",
            "violet",
            "amber",
            "red",
        ],
    },
    css: [
        "~/assets/css/tiptap.css",
        "~/assets/css/transition.css",
        "~/assets/css/main.css",
    ],
    // image: {
    //     provider: "netlifyImageCdn",
    //     domains: [firebaseStorageUrl],
    // },
    // image: {
    //     provider: "ipx",
    //     domains: ["firebasestorage.googleapis.com"],
    // },
    nitro: {
        preset: "netlify",
    },
    routeRules: {
        "/": { ssr: true }, // 首頁，取得firebase realtime db 的 post 資料然後render post 資料卡片
        "/posts/**": { isr: 600 }, // 單篇post頁面，取得firebase realtime db 的 post 資料然後 render post 資料卡片
        "/posts": { ssr: true }, // posts總覽，取得firebase realtime db 的 post 資料然後render頁面
        "/search": { ssr: false, robots: false }, // 搜尋頁面，不須SSR
        "/admin/**": { ssr: false, robots: false },
        "/admin": { ssr: false, robots: false },
        "/auth": { ssr: false, robots: false },
    },
    experimental: {
        watcher: "chokidar",
    },
});
