import type { RequestHandler } from "@sveltejs/kit";
import { toPOJO } from "../../../../../talk/get";
import { BAD, DENIED, OK, PostLevelSchema } from "../../../../../misc";
import { createLevelpack } from "../../../../../talk/create";
import { tryGettingUser } from "../../../../../talk/admin";

export const POST: RequestHandler = async ({ cookies, request }) => {
    const json = await request.json();
    const payload = PostLevelSchema.parse(json);

    const access_token = cookies.get("access_token") ?? json.access_token;
    const refresh_token = cookies.get("refresh_token") ?? json.refresh_token;

    // Get user from access token
    let user = await tryGettingUser(access_token, refresh_token, cookies);
    if (!user) return DENIED();

    try {
        const levelpack = await createLevelpack({
            creator: user,
            title: payload.title,
            description: payload.description,
            level: payload.file,
            modded: payload.modded
        });

        return OK(toPOJO(levelpack));
    } catch (e) {
        console.error(e);
        return BAD("Invalid Payload: " + e);
    }
};
