import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";

declare module "#app" {
    interface NuxtApp {
        $auth: import("firebase/auth").Auth;
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();

    const firebaseConfig = {
        apiKey: config.public.firebaseApiKey as string,
        authDomain: "nuxt-blog-b5610.firebaseapp.com",
        databaseURL: "https://nuxt-blog-b5610-default-rtdb.firebaseio.com",
        projectId: "nuxt-blog-b5610",
        storageBucket: "nuxt-blog-b5610.appspot.com",
        messagingSenderId: "583146395669",
        appId: "1:583146395669:web:a4c72fde19beecba74d61c",
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);

    setPersistence(auth, browserLocalPersistence);

    nuxtApp.vueApp.provide("auth", auth);
    nuxtApp.provide("auth", auth);

    nuxtApp.vueApp.provide("firestore", firestore);
    nuxtApp.provide("firestore", firestore);
});
