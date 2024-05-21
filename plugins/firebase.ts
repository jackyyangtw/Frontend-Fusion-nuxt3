export default defineNuxtPlugin(() => {
    const db = useDatabase();
    const auth = useFirebaseAuth();
    return {
        provide: {
            auth,
            db,
        },
    };
});
