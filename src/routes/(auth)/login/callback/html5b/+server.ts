import { redirect, type RequestHandler } from "@sveltejs/kit";
import { redirectURL_html5b } from "$lib/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import type { DiscordMeta, PocketbaseUser } from "$lib/types";

const schema = createObjectSchema("code");
export const GET: RequestHandler = async ({ cookies, locals, url }) => {
    const { code } = parseFromUrlSearchParams(schema, url);
    const codeVerifier = cookies.get("discord_code_verifier");
    if (!codeVerifier) return redirect(308, "/");

    const { record, token } = (await locals.pb
        .collection("5beam_users")
        .authWithOAuth2Code("discord", code, codeVerifier, redirectURL_html5b)) as {
        meta: DiscordMeta;
        record: PocketbaseUser;
        token: string;
    };

    cookies.delete("discord_code_verifier", { path: "/" });

    // big thanks to advertisers for ruining third party cookies

    const fivebeam_auth = encodeURI(JSON.stringify({ record, token }));

    return new Response("", {
        status: 302,
        headers: {
            location: `https://coppersalts.github.io/HTML5b/authredirect?5beam_auth=${fivebeam_auth}`
            // location: `http://127.0.0.1:8080/authredirect.html?5beam_auth=${fivebeam_auth}`
        }
    });
};
