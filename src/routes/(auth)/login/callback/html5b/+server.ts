import { redirect, type RequestHandler } from "@sveltejs/kit";
import { apiURL } from "$lib/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import type { DiscordMeta, PocketbaseUser } from "$lib/types";

const schema = createObjectSchema("code");
export const GET: RequestHandler = async ({ cookies, locals, url }) => {
    const { code } = parseFromUrlSearchParams(schema, url);
    const codeVerifier = cookies.get("discord_code_verifier");
    if (!codeVerifier) return redirect(308, "/");

    const { token } = (await locals.pb
        .collection("5beam_users")
        .authWithOAuth2Code("discord", code, codeVerifier, `${apiURL}/login/callback/html5b`)) as {
        meta: DiscordMeta;
        record: PocketbaseUser;
        token: string;
    };

    cookies.delete("discord_code_verifier", { path: "/" });

    return new Response("", {
        status: 302,
        headers: {
            // location: `https://coppersalts.github.io/HTML5b/authredirect?5beam_auth=${token}`
            location: `http://localhost:8080/authredirect.html?5beam_auth=${token}`
        }
    });
};
