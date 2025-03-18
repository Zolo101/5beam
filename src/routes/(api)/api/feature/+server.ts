import { NewFeaturedWebhook } from "$lib/webhook";
import { NOT_FOUND } from "../../../../misc";
import { DENIED, isAdmin, MY_BAD, OK } from "../../../../misc";
import { tryGettingUser } from "../../../../talk/admin";
import { featureLevel } from "../../../../talk/create";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, url }) => {
    const id = url.searchParams.get("id");

    const access_token = cookies.get("access_token") ?? "";
    const refresh_token = cookies.get("refresh_token") ?? "";

    const user = await tryGettingUser(access_token, refresh_token, cookies);
    if (!user) return DENIED();

    const allowed = isAdmin(user);
    if (!allowed) return DENIED();

    if (id) {
        try {
            const level = await featureLevel(id);
            await NewFeaturedWebhook.send(level);
            return OK();
        } catch (e) {
            return MY_BAD("Failed to feature level");
        }
    } else {
        return NOT_FOUND();
    }
};
