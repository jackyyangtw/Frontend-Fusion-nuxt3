export default defineNuxtPlugin(() => {
    const db = useDatabase();
    const auth = useFirebaseAuth();
    const storage = useFirebaseStorage();
    return {
        provide: {
            auth,
            db,
            storage,
        },
    };
});
