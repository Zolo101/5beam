import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { _deleteLevel } from "$lib/server/delete";

const urlSchema = createObjectSchema("id");

export const POST: RequestHandler = async ({ url }) => {
    try {
        const { id } = parseFromUrlSearchParams(urlSchema, url);
        try {
            return _deleteLevel({ id });
        } catch (e) {
            console.error(e);
            return MY_BAD();
        }
    } catch (e) {
        console.error(e);
        return BAD();
    }
};
