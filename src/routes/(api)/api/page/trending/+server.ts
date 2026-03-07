import type { RequestHandler } from "@sveltejs/kit";
import { getTrendingLevelpacks, getTrendingLevels } from "$lib/get.remote";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("page", "amount", "mod", "type");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { page, amount, mod, type } = parseFromUrlSearchParams(schema, url);
        try {
            const getFunc = type ? getTrendingLevelpacks : getTrendingLevels;
            return OK(await getFunc({ page, amount, mod }));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
