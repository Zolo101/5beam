import type { RequestHandler } from "@sveltejs/kit";
import { getUserStarredItems } from "$lib/get.remote";
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
            return OK(
                await getUserStarredItems(id, page, type, sort, featured, amount, mod, {
                    requestKey: null
                })
            );
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
