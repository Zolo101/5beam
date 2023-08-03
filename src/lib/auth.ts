// import DiscordOauth2 from "discord-oauth2"
import { redirectURL } from "../misc";

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

export const oauth = undefined;
// export const oauth = new DiscordOauth2({
//     clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
//     clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET
// })

export async function requestToken(code: string, redirectUri = redirectURL) {
    // const result = await oauth.tokenRequest({
    //     code: code,
    //     scope: ["identify"],
    //     grantType: "authorization_code",
    //     redirectUri: redirectUri
    // })
    //
    // return result
}