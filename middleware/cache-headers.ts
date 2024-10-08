// // server/middleware/cache-headers.js
// export default defineNuxtRouteMiddleware((to, from) => {
//     // 判斷是否為圖片請求 (根據路徑或 Content-Type)
//     if (
//         to.path.endsWith(".jpg") ||
//         to.path.endsWith(".png") ||
//         to.path.endsWith(".jpeg") ||
//         to.path.endsWith(".webp")
//     ) {
//         return handleImageCache(to.req, to.res);
//     }
// });

// function handleImageCache(req, res) {
//     // 設定快取控制標頭
//     res.setHeader("Cache-Control", "public, max-age=31536000"); // 快取一年
//     res.setHeader("Expires", new Date(Date.now() + 31536000000).toUTCString()); // 設定過期時間
// }
