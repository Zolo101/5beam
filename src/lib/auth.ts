import DiscordOauth2 from "discord-oauth2"
import { redirectURL } from "../misc";
import type { Cookies } from "@sveltejs/kit";

export type DiscordUser = {
    accent_color?: string
    avatar?: string
    avatar_decoration?: string
    banner?: string
    banner_color?: string
    discriminator: string
    flags: number
    id: string
    locale: string
    mfa_enabled: boolean
    public_flags: number
    username: string
}

export const oauth = new DiscordOauth2({
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
    clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET
})

// Used for when you don't have a refresh token
export async function requestTokenLogIn(code: string, redirectUri = redirectURL) {
    return await oauth.tokenRequest({
        code,
        redirectUri,
        scope: ["identify"],
        grantType: "authorization_code",
    })

    // TODO: Get user database info
    // const user = await oauth.getUser(result.access_token);
    // localStorage.setItem()
}

export async function refreshTokenRequest(cookies: Cookies, refreshToken: string) {
    return oauth.tokenRequest({
        refreshToken,
        scope: ["identify"],
        grantType: "refresh_token",
    })
        .then(result => result)
        .catch(() => {
            // refresh_token is invalid, force logout
            cookies.delete("refresh_token")
            return undefined;
        })
}

export function setAccessToken(cookies: Cookies, token: string, expiresIn: number) {
    const expires = new Date(Date.now() + expiresIn)
    // usually ~10 minutes (604800 unix time)

    cookies.set("access_token", token, {
        path: "/",
        expires,
        httpOnly: true,
    })
}

export function setRefreshToken(cookies: Cookies, token: string) {
    const expires = new Date(Date.now() + 604800000)
    // usually 7 days is good enough (604800000 unix time)

    cookies.set("refresh_token", token, {
        path: "/",
        expires,
        httpOnly: true,
    })
}