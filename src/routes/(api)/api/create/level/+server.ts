import type { RequestHandler } from "@sveltejs/kit";
import { BAD, DENIED, MY_BAD, OK, PostLevelSchema } from "../../../../../misc";
import { createLevel } from "../../../../../talk/create";
import { tryGettingUser } from "../../../../../talk/admin";
import { createObjectSchema } from "$lib/parse";

const cookiesSchema = createObjectSchema("access_token", "refresh_token");
export const POST: RequestHandler = async ({ cookies, request }) => {
    try {
        const json = await request.json();
        const payload = PostLevelSchema.parse(json);

        const { success, data } = cookiesSchema.safeParse(cookies);

        let access_token: string;
        let refresh_token: string;

        if (success) {
            access_token = data.access_token;
            refresh_token = data.refresh_token;
        } else {
            // Attempt to get tokens from request body (from other website etc)
            access_token = json.access_token;
            refresh_token = json.refresh_token;
        }

        // Get user from access token
        const user = await tryGettingUser(access_token, refresh_token, cookies);
        if (!user) return DENIED();

        try {
            const level = await createLevel({
                creator: user,
                title: payload.title,
                description: payload.description,
                level: payload.file,
                modded: payload.modded
            });

            return OK(level);
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
