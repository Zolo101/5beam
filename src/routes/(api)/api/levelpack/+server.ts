import type { RequestHandler } from "@sveltejs/kit";
import { OK, NOT_FOUND } from "$lib/server/misc";
import { getLevelpackById, getLevelpackByIdWithLevels } from "$lib/get.remote";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

// TODO: If user is logged in, include starred as well
const schema = createObjectSchema("id", "levels");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, levels } = parseFromUrlSearchParams(schema, url);
        // TODO: handle user logged in case we want to show starred info
        const getFunc = levels ? getLevelpackByIdWithLevels : getLevelpackById;
        return OK(await getFunc(id));
    } catch {
        return NOT_FOUND();
    }
};
