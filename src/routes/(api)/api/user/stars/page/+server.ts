import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { getUserLevelpackStars, getUserLevelStars } from "$lib/get.remote";

const schema = createObjectSchema("id", "page", "type", "sort", "featured", "mod", "amount");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, page, type, sort, featured, mod, amount } = parseFromUrlSearchParams(
            schema,
            url
        );

        try {
            const func = type === 0 ? getUserLevelStars : getUserLevelpackStars;
            return OK(
                await func({
                    id,
                    page,
                    sortCode: sort,
                    featured,
                    amount,
                    mod,
                    options: {
                        requestKey: null
                    }
                })
            );
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
