// server/api/__sitemap__/urls.ts
// if "/" CSR mode will not work
// if "/" prerender mode will work, but deploy to netlify stuck

// https://nuxtseo.com/sitemap/guides/dynamic-urls
// https://vuefire.vuejs.org/guide/ssr.html#Usage-outside-of-components
// import { asSitemapUrl, defineSitemapEventHandler } from "#imports";
import { useDatabase } from "vuefire";
import { ref as dbRef, get, DatabaseReference } from "firebase/database";
import { initializeApp } from "firebase/app";
export default defineSitemapEventHandler(async () => {
    const { vueFireConfig } = useRuntimeConfig();
    const app = initializeApp(vueFireConfig);
    if (app) {
        const db = useDatabase();
        const postRef: DatabaseReference = dbRef(db, "posts");
        const snapshot = await get(postRef);

        const posts: any[] = [];
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (const key in data) {
                posts.push({ id: key, ...data[key] });
            }
        }
        return [
            ...posts.map((post) =>
                asSitemapUrl({
                    loc: `/posts/${post.id}`,
                    changefreq: "weekly",
                    priority: 0.8,
                    lastmod: post.updatedDate,
                })
            ),
        ];
    }
    return [];
});
