import type { RequestHandler } from "@sveltejs/kit";
import { getUserLevelpacks, getUserLevels } from "../../../../../talk/get";
import { BAD, OK, MY_BAD } from "../../../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("id", "page", "type", "sort", "featured", "mod");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, page, type, sort, featured, mod } = parseFromUrlSearchParams(schema, url);

        try {
            const getFunc = type ? getUserLevelpacks : getUserLevels;
            return OK(await getFunc(id, page, sort, featured, mod));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
