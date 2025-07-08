import type { RequestHandler } from "@sveltejs/kit";
import { getUserByDiscordId, getUserById } from "../../../../talk/get";
import { OK, NOT_FOUND, BAD, MY_BAD } from "../../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("id", "discordId");
export const GET: RequestHandler = async ({ url }) => {
    try {
        // NEW: Only use discordId if id is null
        const { id, discordId } = parseFromUrlSearchParams(schema, url);
        try {
            const user = id === null ? await getUserByDiscordId(discordId) : await getUserById(id);
            if (user === null) {
                return NOT_FOUND();
            } else {
                return OK(user);
            }
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
