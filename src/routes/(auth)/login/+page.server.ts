import { dev } from "$app/environment";
import { redirect, type Actions } from "@sveltejs/kit";
import { redirectURL, redirectURL_html5b } from "$lib/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { getHtml5bClient } from "$lib/server/html5bAuth";

const schema = createObjectSchema("redirectURI", "client");
export const actions = {
    default: async ({ locals, cookies, request, url }) => {
        const { redirectURI, client } = parseFromUrlSearchParams(schema, url);

        const authMethods = await locals.pb.collection("5beam_users").listAuthMethods();

        // Find the Discord OAuth2 auth method
        const discordAuth = authMethods.oauth2.providers.find(
            (provider) => provider.name === "discord"
        );
        if (!discordAuth) {
            return new Response("Discord OAuth2 provider not found", { status: 500 });
        }

        // I dont want email
        const authURL = discordAuth.authURL.replace("identify+email", "identify");

        cookies.set("discord_code_verifier", discordAuth.codeVerifier, { path: "/" });

        if (redirectURI === redirectURL_html5b) {
            cookies.set(
                "html5b_auth_client",
                getHtml5bClient(client, request.headers.get("referer")),
                {
                    path: "/login/callback/html5b",
                    httpOnly: true,
                    sameSite: "lax",
                    secure: !dev
                }
            );
        }

        // Redirect to the Discord OAuth2 URL
        // redirectURI is the user given redirectURL (5beam oauth)
        // redirectURL is the default redirectURL (5beam oauth)
        // TODO: Change variable names
        return redirect(302, authURL + (redirectURI ? redirectURI : redirectURL));
    }
} satisfies Actions;
