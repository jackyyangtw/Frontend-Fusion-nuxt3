export const useFetchRealTimeDb = async (
    route: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    handler = {}
) => {
    const config = useRuntimeConfig();
    try {
        const res = $fetch(`${config.public.firebaseBaseUrl}/${route}.json`, {
            method,
            handler,
        });
        return res;
    } catch (err) {
        console.log(err);
    }
};
