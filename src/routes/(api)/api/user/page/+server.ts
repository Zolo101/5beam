import type { RequestHandler } from "@sveltejs/kit";
import { getUserLevelpacks, getUserLevels } from "$lib/get.remote";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("id", "page", "type", "sort", "featured", "mod", "amount");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, page, type, sort, featured, mod, amount } = parseFromUrlSearchParams(
            schema,
            url
        );

        try {
            const getFunc = type ? getUserLevelpacks : getUserLevels;
            return OK(await getFunc(id, page, sort, featured, amount, mod));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
