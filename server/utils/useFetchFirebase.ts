export const useFetchFirebase = async (
    route: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    handler = {}
) => {
    const config = useRuntimeConfig();
    try {
        const res = $fetch(`${config.public.firebaseBaseUrl}/${route}.json`, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            handler,
        });
        return res;
    } catch (err) {
        console.log(err);
    }
};
