import type { RequestHandler } from "@sveltejs/kit";
import { getLevel, getUser } from "../../talk";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get("id"))

    if (id === null) {
        return {
            status: 404,
        }
    }
    return {
        status: 200,
        body: await getUser(id)
    }
}