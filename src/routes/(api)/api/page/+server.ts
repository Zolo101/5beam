import type { RequestHandler } from "@sveltejs/kit";
import { getLevelpacks, getLevels } from "../../../../talk/get";
import { BAD, MY_BAD, OK } from "../../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("page", "type", "sort", "featured", "mod", "amount");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { page, type, sort, featured, mod, amount } = parseFromUrlSearchParams(schema, url);
        try {
            const getFunc = type === 0 ? getLevels : getLevelpacks;
            return OK(await getFunc(page, sort, featured, mod, amount));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
