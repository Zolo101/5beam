import { createObjectSchema } from "$lib/parse";
import { NewFeaturedWebhook } from "$lib/webhook";
import { BAD } from "../../../../misc";
import { DENIED, isAdmin, MY_BAD, OK } from "../../../../misc";
import { tryGettingUser } from "../../../../talk/admin";
import { featureLevel } from "../../../../talk/create";
import type { RequestHandler } from "./$types";

const urlSchema = createObjectSchema("id");
const cookiesSchema = createObjectSchema("access_token", "refresh_token");
export const POST: RequestHandler = async ({ cookies, url }) => {
    try {
        const { id } = urlSchema.parse(url);

        const { access_token, refresh_token } = cookiesSchema.parse(cookies);

        const user = await tryGettingUser(access_token, refresh_token, cookies);
        if (!user) return DENIED();

        const allowed = isAdmin(user);
        if (!allowed) return DENIED();

        try {
            const level = await featureLevel(id);
            await NewFeaturedWebhook.send(level);
            return OK();
        } catch {
            return MY_BAD("Failed to feature level");
        }
    } catch {
        return BAD();
    }
};
