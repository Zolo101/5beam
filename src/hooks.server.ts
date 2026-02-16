import { dev } from "$app/environment";
import type { Handle } from "@sveltejs/kit";
import Pocketbase from "pocketbase";

// TODO: Rename "protected" -> "restricted"?
// This is required for accessing protected routes, see the "CORS" section of https://5beam.zelo.dev/api for more info.
const protectedDomains = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://coppersalts.github.io"
];

const protectedRoutes = [
    "/api/level/star",
    "/api/levelpack/star",
    "/api/create/level",
    "/api/create/levelpack",
    "/api/modify/level",
    "/api/modify/levelpack",
    "/api/profile",
    "/login",
    "/logout"
];

export const handle = (async ({ event, resolve }) => {
    event.locals.pb = new Pocketbase("https://cdn.zelo.dev");
    try {
        event.locals.pb.authStore.loadFromCookie(
            event.request.headers.get("cookie") || event.request.headers.get("Authorization") || ""
        );

        if (event.locals.pb.authStore.isValid) {
            event.locals.user = await event.locals.pb.collection("5beam_users").authRefresh();
        }
    } catch {
        event.locals.pb.authStore.clear();
    }

    const origin = event.request.headers.get("origin") || "";

    // CORS preflight (Auth) - only for protected routes
    if (event.request.method === "OPTIONS" && protectedRoutes.includes(event.url.pathname)) {
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

    if (protectedRoutes.includes(event.url.pathname)) {
        // Protected routes: only allow access from protected domains
        if (protectedDomains.includes(origin)) {
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            response.headers.set("Access-Control-Allow-Origin", origin);
            response.headers.set("Access-Control-Allow-Headers", "Authorization");
            response.headers.set("Access-Control-Allow-Credentials", "true");
        }
    } else if (event.url.pathname.startsWith("/api")) {
        // Non-protected API routes: allow access from any origin
        response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.headers.set("Access-Control-Allow-Origin", "*");
    }

    // TODO: Make this only set when origin is 5beam.zelo.dev
    response.headers.append(
        "set-cookie",
        event.locals.pb.authStore.exportToCookie({
            secure: !dev,
            httpOnly: true,
            // TODO: Make this strict since we arent going the third party cookie route
            // its OK to use in this instance but be careful https://web.dev/articles/samesite-cookies-explained
            sameSite: "lax"
        })
    );

    return response;
}) satisfies Handle;
