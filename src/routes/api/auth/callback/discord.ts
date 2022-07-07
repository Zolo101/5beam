import type { RequestHandler } from "@sveltejs/kit";
import type { DiscordUser } from "../../../../lib/auth";
import { oauth, requestToken } from "../../../../lib/auth";
import { session } from "$app/stores";
import { get as svelteGet } from 'svelte/store';
import { createUser, getUserByDiscordId } from "../../../../talk";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const code = url.searchParams.get("code") ?? ""

    const tokenResponse = await requestToken(code)
    const accessToken = tokenResponse.access_token
    const refreshToken = tokenResponse.refresh_token

    const access_token_expires_in = new Date(Date.now() + tokenResponse.expires_in); // 10 minutes
    const refresh_token_expires_in = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days

    await checkUser()

    return {
        status: 302,
        headers: {
            "set-cookie": [
                `access_token=${accessToken}; Path=/; Max-Age=${access_token_expires_in}; HttpOnly`,
                `refresh_token=${refreshToken}; Path=/; Max-Age=${refresh_token_expires_in}; HttpOnly`,
            ],
            location: "/"
        }
    }
}

async function checkUser() {
    const user: (DiscordUser | false) = svelteGet<any>(session).user
    if (user === false) return // not even logged in

    const userData = await getUserByDiscordId(Number(user.id))
    if (userData === null) { // not in database
        await createUser(Number(user.id), user.username) // create user
    }
}