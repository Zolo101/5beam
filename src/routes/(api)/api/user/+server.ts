import type { RequestHandler } from "@sveltejs/kit";
import { getUserById } from "$lib/get.remote";
import { MY_BAD, BAD, OK, NOT_FOUND } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { ClientResponseError } from "pocketbase";

const schema = createObjectSchema("id");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id } = parseFromUrlSearchParams(schema, url);
        try {
            const user = await getUserById(id);
            if (user === null) {
                return NOT_FOUND();
            } else {
                return OK(user);
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
