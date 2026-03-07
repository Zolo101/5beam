import type { RequestHandler } from "@sveltejs/kit";
import { getRandomLevelpacks, getRandomLevels } from "$lib/get.remote";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("page", "amount", "type", "featured", "mod");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { page, amount, type, featured, mod } = parseFromUrlSearchParams(schema, url);
        try {
            const getFunc = type ? getRandomLevelpacks : getRandomLevels;
            return OK(await getFunc({ page, amount, featured, mod }));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
