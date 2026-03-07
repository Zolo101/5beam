import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { getLevelpackSearch, getLevelSearch } from "$lib/get.remote";

const schema = createObjectSchema("text", "page", "amount", "mod", "type");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { text, page, amount, mod, type } = parseFromUrlSearchParams(schema, url);

        try {
            const getFunc = type ? getLevelpackSearch : getLevelSearch;
            return OK(await getFunc({ text, page, amount, mod, sortCode: 0 }));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
