import type { RequestHandler } from "@sveltejs/kit";
import { getUserByDiscordId, getUserById } from "../../../../talk/get";
import { OK, return404 } from "../../../../misc";

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get("id");
    const discordId = url.searchParams.get("discordId");

    if (id === null) {
        if (discordId !== null) {
            // use discordId
            let body = await getUserByDiscordId(discordId);
            return OK(body);
        } else {
            return return404();
        }
    } else if (discordId === null) {
        // use id
        let body = await getUserById(id);
        return OK(body);
    }
};
