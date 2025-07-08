import type { RequestHandler } from "@sveltejs/kit";
import { getSearch } from "../../../../talk/get";
import { BAD, MY_BAD, OK } from "../../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("text", "page", "amount", "mod");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { text, page, amount, mod } = parseFromUrlSearchParams(schema, url);
        try {
            return OK(await getSearch(text, page, amount, mod));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
