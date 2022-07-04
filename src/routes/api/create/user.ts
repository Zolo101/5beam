import type { RequestHandler } from "@sveltejs/kit";
import { createUser } from "../../../talk";

export const post: RequestHandler = async ({request}) => {
    // await createUser(request)
    return {
        status: 400
    }
}