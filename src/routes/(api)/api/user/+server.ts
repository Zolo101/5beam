import type { RequestHandler } from "@sveltejs/kit";
import { getUserById } from "$lib/server/get";
import { MY_BAD, BAD, OK, NOT_FOUND } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

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
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
