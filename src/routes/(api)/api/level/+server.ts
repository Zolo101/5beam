import type { RequestHandler } from "@sveltejs/kit";
import { OK, NOT_FOUND } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { getLevelById } from "$lib/get.remote";

const schema = createObjectSchema("id");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id } = parseFromUrlSearchParams(schema, url);
        return OK(await getLevelById(id));
    } catch {
        return NOT_FOUND();
    }
};
