import { redirect, type Actions } from "@sveltejs/kit";
import { redirectURL } from "../../../misc";

export const actions = {
    default: async ({ locals, cookies }) => {
        const authMethods = await locals.pb.collection("5beam_users").listAuthMethods();

        // Find the Discord OAuth2 auth method
        const discordAuth = authMethods.oauth2.providers.find(
            (provider) => provider.name === "discord"
        );
        if (!discordAuth) {
            return new Response("Discord OAuth2 provider not found", { status: 500 });
        }

        cookies.set("discord_code_verifier", discordAuth.codeVerifier, { path: "/" });

        // Redirect to the Discord OAuth2 URL
        return redirect(302, discordAuth.authURL + redirectURL);
    }
} satisfies Actions;
