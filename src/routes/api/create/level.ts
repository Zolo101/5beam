import type { RequestHandler } from "@sveltejs/kit";
import { createLevel } from "../../../talk";

export const post: RequestHandler = async ({request}) => {
    // await createLevel(request)

    return {
        headers: { "Content-Type": "application/json" },
        status: 200,
    }
}