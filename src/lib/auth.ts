import { redirectURL } from "../misc";
import type { Cookies } from "@sveltejs/kit";
import DiscordOauth2 from "$lib/DiscordOauth2";

// Used for when you don't have a refresh token
export async function requestTokenLogIn(code: string, redirectUri = redirectURL) {
    return await DiscordOauth2.tokenRequestAuth(code, redirectUri);

    // TODO: Get user database info
    // const user = await oauth.getUser(result.access_token);
    // localStorage.setItem()
}

export async function refreshTokenRequest(cookies: Cookies, refreshToken: string) {
    const result = await DiscordOauth2.tokenRequestRefresh(refreshToken);

    if ("error" in result) {
        cookies.delete("refresh_token", { path: "/" });
        return undefined;
    } else {
        setAccessToken(cookies, result.access_token, result.expires_in);
        setRefreshToken(cookies, result.refresh_token);
        return result;
    }
}

export function setAccessToken(cookies: Cookies, token: string, expiresIn: number) {
    const expires = new Date(Date.now() + expiresIn);
    // usually ~10 minutes (604800 unix time)

    cookies.set("access_token", token, {
        path: "/",
        expires,
        httpOnly: true
    });
}

export function setRefreshToken(cookies: Cookies, token: string) {
    const expires = new Date(Date.now() + 604800000);
    // usually 7 days is good enough (604800000 unix time)

    cookies.set("refresh_token", token, {
        path: "/",
        expires,
        httpOnly: true
    });
}
