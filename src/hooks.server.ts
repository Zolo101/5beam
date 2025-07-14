import { dev } from "$app/environment";
import type { Handle } from "@sveltejs/kit";
import Pocketbase from "pocketbase";

export const handle = (async ({ event, resolve }) => {
    event.locals.pb = new Pocketbase("https://cdn.zelo.dev");
    event.locals.pb.authStore.loadFromCookie(event.request.headers.get("cookie") || "");

    try {
        if (event.locals.pb.authStore.isValid) {
            event.locals.user = await event.locals.pb.collection("5beam_users").authRefresh();
        }
    } catch {
        event.locals.pb.authStore.clear();
    }

    const response = await resolve(event);
    response.headers.delete("Link");

    if (event.url.pathname.startsWith("/api")) {
        response.headers.set("Access-Control-Allow-Methods", "GET, POST");
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Headers", "*");
    }

    if (event.url.pathname.startsWith("/login")) {
        response.headers.set("Access-Control-Allow-Origin", "https://coppersalts.github.io");
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
