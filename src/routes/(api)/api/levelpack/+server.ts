import type { RequestHandler } from "@sveltejs/kit";
import { OK, NOT_FOUND } from "$lib/server/misc";
import { getLevelpackById, getLevelpackByIdWithLevels } from "$lib/server/get";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("id", "levels");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, levels } = parseFromUrlSearchParams(schema, url);
        const getFunc = levels ? getLevelpackByIdWithLevels : getLevelpackById;
        return OK(await getFunc(id));
    } catch {
        return NOT_FOUND();
    }
};
