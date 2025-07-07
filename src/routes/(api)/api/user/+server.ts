import type { RequestHandler } from "@sveltejs/kit";
import { getUserByDiscordId, getUserById } from "../../../../talk/get";
import { OK, NOT_FOUND } from "../../../../misc";

export const GET: RequestHandler = async ({ url }) => {
    const id = url.searchParams.get("id");
    const discordId = url.searchParams.get("discordId");

    // TODO: Too complex
    if (id === null) {
        if (discordId !== null) {
            // use discordId
            const body = await getUserByDiscordId(discordId);
            return OK(body);
        } else {
            return NOT_FOUND();
        }
    } else if (discordId === null) {
        // use id
        const body = await getUserById(id);
        return OK(body);
    } else {
        return NOT_FOUND();
    }
};
