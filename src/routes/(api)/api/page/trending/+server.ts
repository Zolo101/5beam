import type { RequestHandler } from "@sveltejs/kit";
import { getTrendingLevels } from "$lib/talk/get";
import { BAD, MY_BAD, OK } from "$lib/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("page", "amount", "mod");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { page, amount, mod } = parseFromUrlSearchParams(schema, url);
        try {
            return OK(await getTrendingLevels(page, amount, mod));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
