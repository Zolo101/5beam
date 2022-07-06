import DiscordOauth2 from "discord-oauth2"
import { apiURL, redirectURL } from "../misc";

export const oauth = new DiscordOauth2({
    clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
    clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
    redirectUri: redirectURL
})

export async function requestToken(code: string) {
    const result = await oauth.tokenRequest({
        code: code,
        scope: ["identify"],
        grantType: "authorization_code",
    })

    return result
}