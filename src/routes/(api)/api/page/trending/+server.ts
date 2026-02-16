import type { RequestHandler } from "@sveltejs/kit";
import { getTrendingLevels } from "$lib/get.remote";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("page", "amount", "mod");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const args = parseFromUrlSearchParams(schema, url);
        try {
            return OK(await getTrendingLevels(args));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
