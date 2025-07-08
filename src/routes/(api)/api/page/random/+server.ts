import type { RequestHandler } from "@sveltejs/kit";
import { getRandomLevels } from "../../../../../talk/get";
import { BAD, MY_BAD, OK } from "../../../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("amount", "type", "featured", "mod");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { amount, type, featured, mod } = parseFromUrlSearchParams(schema, url);
        try {
            return OK(await getRandomLevels(amount, type, featured, mod));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
