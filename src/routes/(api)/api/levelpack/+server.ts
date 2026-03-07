import type { RequestHandler } from "@sveltejs/kit";
import { OK, NOT_FOUND, BAD, MY_BAD } from "$lib/server/misc";
import { getLevelpackById, getLevelpackByIdWithLevels } from "$lib/get.remote";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { ClientResponseError } from "pocketbase";

// TODO: If user is logged in, include starred as well
const schema = createObjectSchema("id", "levels");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, levels } = parseFromUrlSearchParams(schema, url);
        try {
            // TODO: handle user logged in case we want to show starred info
            const getFunc = levels ? getLevelpackByIdWithLevels : getLevelpackById;
            const levelpack = await getFunc(id);
            if (levelpack === null) {
                return NOT_FOUND();
            } else {
                return OK(levelpack);
            }
        } catch (e) {
            if (e instanceof ClientResponseError && e.status === 404) {
                return NOT_FOUND();
            } else {
                return MY_BAD();
            }
        }
    } catch {
        return BAD();
    }
};
