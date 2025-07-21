import { dev } from "$app/environment";
import type { Handle } from "@sveltejs/kit";
import Pocketbase from "pocketbase";

// This is required for accessing protected routes, DM me if you have a site that uses 5beam and you want to be added!
const protectedDomains = ["http://localhost:8080", "https://coppersalts.github.io"];
const protectedRoutes = [
    "/api/create/level",
    "/api/create/levelpack",
    "/api/modify/level",
    "/api/modify/levelpack",
    "/api/profile",
    "/api/login/oauth",
    "/login",
    "/logout"
];

export const handle = (async ({ event, resolve }) => {
    event.locals.pb = new Pocketbase("https://cdn.zelo.dev");
    event.locals.pb.authStore.loadFromCookie(
        event.request.headers.get("cookie") || event.request.headers.get("Authorization") || ""
    );

    try {
        if (event.locals.pb.authStore.isValid) {
            event.locals.user = await event.locals.pb.collection("5beam_users").authRefresh();
        }
    } catch {
        event.locals.pb.authStore.clear();
    }

    const origin = event.request.headers.get("origin") || "";

    // CORS preflight (Auth)
    if (event.request.method === "OPTIONS" && event.url.pathname.startsWith("/api")) {
        return new Response(null, {
            headers: {
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization",
                "Access-Control-Allow-Credentials": "true"
            }
        });
    }

    const response = await resolve(event);

    if (protectedDomains.includes(origin)) {
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Origin", origin);

        if (protectedRoutes.includes(event.url.pathname)) {
            response.headers.set("Access-Control-Allow-Headers", "Authorization");
            response.headers.set("Access-Control-Allow-Credentials", "true");
        }
    }

    response.headers.append(
        "set-cookie",
        event.locals.pb.authStore.exportToCookie({
            secure: !dev,
            httpOnly: true,
            // its OK to use in this instance but be careful https://web.dev/articles/samesite-cookies-explained
            sameSite: "lax"
        })
    );

    return response;
}) satisfies Handle;
