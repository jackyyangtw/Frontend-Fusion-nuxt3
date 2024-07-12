import {
    type Analytics,
    initializeAnalytics,
    isSupported,
} from "firebase/analytics";
import { useFirebaseApp } from "vuefire";
export default defineNuxtPlugin(async () => {
    const firebaseApp = useFirebaseApp();
    let analytics: Analytics | null = null;
    if (await isSupported()) {
        analytics = initializeAnalytics(firebaseApp);
        console.log("Loaded analytics");
    } else {
        console.log("Analytics not supported");
    }
    return {
        provide: {
            analytics,
        },
    };
});
