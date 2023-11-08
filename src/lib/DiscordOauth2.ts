import { redirectURL, URLParamSet } from "../misc";

// https://github.com/reboxer/discord-oauth2 doesn't work well with netlify edge functions, so i've replaced it with this

export interface User {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null | undefined;
    mfa_enabled?: boolean;
    banner?: string | null | undefined;
    accent_color?: string | null | undefined;
    locale?: string;
    verified?: boolean;
    email?: string | null | undefined;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
}

export interface TokenRequestResult {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    // webhook?: Webhook;
}

export default class DiscordOauth2 {
    // clientId: string = import.meta.env.VITE_AUTH_CLIENT_ID
    // clientSecret: string = import.meta.env.VITE_AUTH_CLIENT_SECRET

    static tokenRequestAuth(code: string, redirectUri: string = redirectURL) {
        const body = new URL("https://discord.com/api/oauth2/token")
        URLParamSet(body, "client_id", import.meta.env.VITE_AUTH_CLIENT_ID)
        URLParamSet(body, "client_secret", import.meta.env.VITE_AUTH_CLIENT_SECRET)
        URLParamSet(body, "grant_type", "authorization_code")
        URLParamSet(body, "redirect_uri", redirectUri)
        URLParamSet(body, "code", code)
        URLParamSet(body, "scope", "identify")

        return sendRequest(body)
    }

    static tokenRequestRefresh(token: string) {
        const body = new URL("https://discord.com/api/oauth2/token")
        URLParamSet(body, "client_id", import.meta.env.VITE_AUTH_CLIENT_ID)
        URLParamSet(body, "client_secret", import.meta.env.VITE_AUTH_CLIENT_SECRET)
        URLParamSet(body, "grant_type", "refresh_token")
        URLParamSet(body, "refresh_token", token)
        URLParamSet(body, "scope", "identify")

        return sendRequest(body)
    }

    static async getUser(token: string): Promise<User> {
        const result = await fetch("https://discord.com/api/users/@me", {
            headers: {
                "User-Agent": "Discord-OAuth2",
                "Accept-Encoding": "gzip,deflate",
                "Authorization": `Bearer ${token}`,
            }
        })

        return result.json()
    }
}

async function sendRequest(url: URL): Promise<TokenRequestResult> {
    const result = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: url.searchParams.toString(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "refresh_token": url.searchParams.get("refresh_token") ?? ""
        }
    })

    return result.json()
}