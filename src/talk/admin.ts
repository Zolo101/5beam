import DiscordOauth2 from "$lib/DiscordOauth2";
import { refreshTokenRequest } from "$lib/auth";
import type { Cookies } from "@sveltejs/kit";

export async function tryGettingUser(access_token: string, refresh_token: string, cookies: Cookies) {
    try {
        return await DiscordOauth2.getUser(access_token)
    } catch (e) {
        // Refresh token and try again
        if (refresh_token) {
            let result = await refreshTokenRequest(cookies, refresh_token)

            if (result) {
                return await DiscordOauth2.getUser(result.access_token)
            } else {
                return undefined
            }
        } else {
            return undefined
        }
    }
}