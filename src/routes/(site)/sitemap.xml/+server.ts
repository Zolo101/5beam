import type { RequestHandler } from "@sveltejs/kit";
import { apiURL } from "$lib/misc";
import { adminPb } from "$lib/server/adminPocketbase";

function formatDate(date: string) {
    // format as YYYY-MM-DD
    return new Date(date).toISOString().split("T")[0];
}

async function createLevelSitemap() {
    return (await adminPb.collection("5beam_levels").getFullList({ requestKey: null })).map(
        (level) => `<url>
    <loc>${apiURL}/level/${level.id}</loc>
    <lastmod>${formatDate(level.updated)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
</url>`
    );
}

async function createLevelpackSitemap() {
    return (await adminPb.collection("5beam_levelpacks").getFullList()).map(
        (levelpack) => `<url>
    <loc>${apiURL}/levelpack/${levelpack.id}</loc>
    <lastmod>${formatDate(levelpack.updated)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
</url>`
    );
}

async function createUserSitemap() {
    return (await adminPb.collection("5beam_users").getFullList()).map(
        (user) => `<url>
    <loc>${apiURL}/user/${user.id}</loc>
    <lastmod>${formatDate(user.updated)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
</url>`
    );
}

async function mainSitemap() {
    const lastUpdate = await adminPb
        .collection("5beam_levels")
        .getFullList({ sort: "-created", limit: 1, requestKey: null });
    return `<url>
    <loc>${apiURL}</loc>
    <lastmod>${formatDate(lastUpdate[0].updated)}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
</url>
<url>
    <loc>${apiURL}/api</loc>
    <lastmod>2023-08-04</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
</url>`;
}

async function sitemap() {
    return [
        await Promise.all([
            mainSitemap(),
            createLevelSitemap(),
            createLevelpackSitemap(),
            createUserSitemap()
        ])
    ].join("\n");
}

export const GET: RequestHandler = async () => {
    const urls = await sitemap();
    return new Response(
        `
        <?xml version="1.0" encoding="UTF-8" ?>
        <urlset
            xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xhtml="https://www.w3.org/1999/xhtml"
            xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
            xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
            xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
            xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
        >
            ${urls}
        </urlset>`.trim(),
        {
            headers: {
                "Content-Type": "application/xml"
            }
        }
    );
};
