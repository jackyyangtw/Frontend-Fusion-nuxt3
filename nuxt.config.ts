// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: true,
    devtools: { enabled: true },
    modules: [
        "@pinia/nuxt",
        "@vueuse/nuxt",
        "nuxt-schema-org",
        "nuxt-vuefire",
        "@nuxt/ui",
        "nuxt-tiptap-editor",
        "@nuxt/image",
        "nuxt-multi-cache",
    ],
    multiCache: {
        component: {
            enabled: true,
            maxAge: 1000 * 60 * 15,
        },
        data: {
            enabled: true,
        },
    },
    // image: {
    //     domains: ["firebasestorage.googleapis.com"],
    // },
    tiptap: {
        prefix: "Tiptap", //prefix for Tiptap imports, composables not included
        lowlight: {
            // list https://github.com/modbender/nuxt-tiptap-editor/blob/7dfbe1c213af472f8f7a50b0e3dd5a7dd8552ce9/src/types.d.ts#L3
            theme: "github-dark",
        },
    },
    vuefire: {
        config: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID,
        },
        auth: {
            enabled: true,
            persistence: ["indexedDBLocal"],
        },
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
                // {
                //     rel: "stylesheet",
                //     href: "https://fonts.googleapis.com/css?family=Open+Sans",
                // },
                {
                    rel: "preload",
                    href: "https://fonts.googleapis.com/css?family=Open+Sans",
                    as: "style",
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
        },
    },
    imports: {
        dirs: ["types/*"],
        autoImport: true,
    },
    ui: {
        icons: ["la"],
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
    nitro: {
        preset: process.env.NODE_ENV === "development" ? "firebase" : "netlify",
    },
    // router: {
    //     extendRoutes(routes, resolve) {
    //         routes.push({
    //             name: "posts-id",
    //             path: "/posts/:id",
    //             component: resolve(__dirname, "pages/posts/[id].vue"),
    //         });
    //     },
    // },
});
