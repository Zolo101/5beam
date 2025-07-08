import DiscordOauth2 from "$lib/DiscordOauth2";
import { refreshTokenRequest } from "$lib/auth";
import type { Cookies } from "@sveltejs/kit";

export async function tryGettingUser(
    access_token: string | undefined,
    refresh_token: string | undefined,
    cookies: Cookies
) {
    try {
        if (!access_token) return null;
        return await DiscordOauth2.getUser(access_token);
    } catch {
        // Refresh token and try again
        if (refresh_token) {
            const result = await refreshTokenRequest(cookies, refresh_token);

            if (result) {
                return await DiscordOauth2.getUser(result.access_token);
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
}
