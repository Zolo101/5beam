import type { RequestHandler } from "@sveltejs/kit";
import { getUserAllStarredItems } from "$lib/get.remote";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("id", "type");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, type } = parseFromUrlSearchParams(schema, url);

        try {
            return OK(await getUserAllStarredItems({ id, type }));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
