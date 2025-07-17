import { BAD, OK } from "../../../../misc";
import { getUserById } from "../../../../talk/get";
import type { RequestHandler } from "./$types";

// This gives the public user not private
export const GET: RequestHandler = async ({ locals }) => {
    try {
        const id = locals.user.record.id;
        return OK(await getUserById(id));
    } catch (e) {
        console.error(e);
        return BAD();
    }
};
