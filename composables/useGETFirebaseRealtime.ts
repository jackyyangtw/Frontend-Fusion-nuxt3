import { onValue, ref as FRef } from "firebase/database";

export const useGETFirebaseRealtime = async (path: string) => {
    const { $db } = useNuxtApp();
    const starCountRef = FRef($db, path);
    onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data);
    });
};
