import type { RequestHandler } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import type { DiscordMeta, PocketbaseUser } from "$lib/types";
import { apiURL } from "$lib/misc";

const schema = createObjectSchema("code", "state");
export const GET: RequestHandler = async ({ url, cookies, locals }) => {
    const { code } = parseFromUrlSearchParams(schema, url);
    const codeVerifier = cookies.get("discord_code_verifier");
    if (!codeVerifier) return redirect(308, "/");

    (await locals.pb
        .collection("5beam_users")
        .authWithOAuth2Code("discord", code, codeVerifier, `${apiURL}/login/redirect/discord`)) as {
        meta: DiscordMeta;
        record: PocketbaseUser;
        token: string;
    };

    cookies.delete("discord_code_verifier", { path: "/" });

    // TODO: Will need to use sudo for this
    // I'm gonna do this internally
    // if (meta.username !== record.username) {
    //     // updateFetch(usersV2, record.id, { username: meta.username });
    //     usersV2.update(record.id, {
    //         username: meta.username
    //     });
    // }

    // cookies.set("pb_auth", locals.pb.authStore.exportToCookie({ sameSite: "lax" }), {
    //     path: "/",
    //     secure: false,
    //     httpOnly: true,
    //     maxAge: 60 * 10 // 10 minutes
    // });

    return redirect(303, "/");
};
