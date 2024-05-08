export default defineEventHandler(async (event) => {
    const { id } = getRouterParams(event);
    const data = await useFetchRealTimeDb(`posts/${id}`, "GET", {
        onResponse: ({ response }: { response: any }) => {
            if (!response.ok) {
                throw new Error("Failed to fetch post");
            }
            return response._data;
        },
    });
    return data;
});
