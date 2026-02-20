import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { _deleteLevelpack } from "$lib/server/delete";

const urlSchema = createObjectSchema("id", "cascade");

export const POST: RequestHandler = async ({ url }) => {
    try {
        const { id, cascade } = parseFromUrlSearchParams(urlSchema, url);

        try {
            return _deleteLevelpack({ id, cascade });
        } catch (e) {
            console.error(e);
            return MY_BAD();
        }
    } catch (e) {
        console.error(e);
        return BAD();
    }
};
