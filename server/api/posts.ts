export default defineEventHandler(async (event) => {
    // const baseURL = "https://nuxt-blog-b5610-default-rtdb.firebaseio.com";
    const resourcePath = "posts.json"; // 根據需要調整路徑
    const config = useRuntimeConfig();
    const response = await fetch(
        `${config.public.firebaseBaseUrl}/${resourcePath}`,
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch data: " + response.statusText);
    }

    const data = await response.json();
    return data;
});
