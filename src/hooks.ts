import { oauth } from "$lib/auth";
import cookie from "cookie";
// import type { User } from "discord-oauth2";

// TODO: Figure out the type for event
export async function getSession(event: any): Promise<{user} | {user: false}> {
    const cookies = cookie.parse(event.request.headers.get("cookie") || '');

    if (cookies.access_token) {
        const user = await oauth.getUser(cookies.access_token);
        // console.log(user)
        return {user}
    }

    return {
        user: false
    }
}