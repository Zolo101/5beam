import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { getLevelSearch } from "$lib/get.remote";

const schema = createObjectSchema("text", "page", "amount", "mod");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { text, page, amount, mod } = parseFromUrlSearchParams(schema, url);
        try {
            // TODO: Ask if people want levelpack search
            return OK(await getLevelSearch({ text, page, amount, mod, sortCode: 0 }));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
