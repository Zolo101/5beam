import { SvelteKitAuth } from "sk-auth";
import { OAuth2Provider } from "sk-auth/providers";

export const appAuth = new SvelteKitAuth({
    providers: [
        new OAuth2Provider({
            accessTokenUrl: "https://discord.com/api/oauth2/token",
            // profileUrl: "https://discord.com/api/oauth2/userInfo",
            authorizationUrl: "https://discord.com/api/oauth2/authorize",
            redirect: "http://localhost:3000/api/auth/callback/discord",
            clientId: import.meta.env.VITE_AUTH_CLIENT_ID,
            clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET,
            scope: ["identify", "email"],
            id: "discord",
            content: "application/x-www-form-urlencoded",
        })
    ]
})