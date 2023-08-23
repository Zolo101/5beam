import { oauth } from "$lib/auth";
import type { Handle } from "@sveltejs/kit";

export const handle = (async ({ event, resolve }) => {
    const accessToken = event.cookies.get("access_token");

    if (accessToken) event.locals.user = await oauth.getUser(accessToken);
    return resolve(event);
}) satisfies Handle;