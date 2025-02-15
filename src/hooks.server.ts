import type { Handle } from "@sveltejs/kit";
import DiscordOauth2 from "$lib/DiscordOauth2";

export const handle = (async ({ event, resolve }) => {
    const accessToken = event.cookies.get("access_token");

    if (accessToken) event.locals.user = await DiscordOauth2.getUser(accessToken);

    const response = await resolve(event);
    response.headers.delete("Link");

    if (event.url.pathname.startsWith("/api")) {
        response.headers.set("Access-Control-Allow-Methods", "GET, POST");
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Headers", "*");
    }

    if (event.url.pathname.startsWith("/api/auth")) {
        response.headers.set("Access-Control-Allow-Origin", "https://coppersalts.github.io");
    }

    return response;
}) satisfies Handle;
