import { useFetchRealTimeDb } from "~/server/utils/useFetchRealTimeDb";
export default defineEventHandler(async (event) => {
    const data = await useFetchRealTimeDb("posts", "GET", {
        onResponse({ response }: { response: any }) {
            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }
            return response._data;
        },
    });
    return data;
});
