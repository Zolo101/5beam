import type { RequestHandler } from "@sveltejs/kit";
import { OK, NOT_FOUND, MY_BAD, BAD } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { getLevelById } from "$lib/get.remote";
import { ClientResponseError } from "pocketbase";

// TODO: If user is logged in, include starred as well
const schema = createObjectSchema("id");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id } = parseFromUrlSearchParams(schema, url);
        try {
            const level = await getLevelById(id);
            if (level === null) {
                return NOT_FOUND();
            } else {
                return OK(level);
            }
        } catch (e) {
            if (e instanceof ClientResponseError && e.status === 404) {
                return NOT_FOUND();
            } else {
                return MY_BAD();
            }
        }
    } catch {
        return BAD();
    }
};
