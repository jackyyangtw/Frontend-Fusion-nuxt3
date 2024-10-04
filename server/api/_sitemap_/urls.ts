// server/api/__sitemap__/urls.ts
import { asSitemapUrl, defineSitemapEventHandler } from "#imports";
import { useDatabase } from "vuefire";
import { ref as dbRef, get, DatabaseReference } from "firebase/database";

export default defineSitemapEventHandler(async () => {
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
                changefreq: "daily",
                priority: 0.8,
                lastmod: post.updatedDate,
            })
        ),
    ];
});
