import { redirect, type Actions } from "@sveltejs/kit";
import { redirectURL } from "../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("redirectURI");
export const actions = {
    default: async ({ locals, cookies, url }) => {
        const { redirectURI } = parseFromUrlSearchParams(schema, url);

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
        // redirectURI is the user given redirectURL (5beam oauth)
        // redirectURL is the default redirectURL (5beam oauth)
        // TODO: Change variable names
        return redirect(302, discordAuth.authURL + (redirectURI ? redirectURI : redirectURL));
    }
} satisfies Actions;
