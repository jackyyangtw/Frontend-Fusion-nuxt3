// import { getFirestore } from "firebase/firestore";
// import { getDatabase } from "firebase/database";
// import {
//     getAuth,
//     // setPersistence,
//     // browserLocalPersistence,
// } from "firebase/auth";

// declare module "#app" {
//     interface NuxtApp {
//         $firebaseApp: FirebaseApp;
//     }
// }

export default defineNuxtPlugin((nuxtApp) => {
    // const app = nuxtApp.$firebaseApp as FirebaseApp;
    const db = useDatabase();
    const auth = useFirebaseAuth();
    return {
        provide: {
            auth,
            db,
        },
    };
});
