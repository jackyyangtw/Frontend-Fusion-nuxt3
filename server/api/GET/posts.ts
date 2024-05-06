import { useFetchFirebase } from "~/server/utils/useFetchFirebase";
export default defineEventHandler(async (event) => {
    const data = await useFetchFirebase("posts", "GET", {
        onResponse: ({ response }) => {
            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }
            return response._data;
        },
    });
    return data;
});
