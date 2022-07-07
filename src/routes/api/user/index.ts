import type { RequestHandler } from "@sveltejs/kit";
import { getLevel, getUserByDiscordId, getUserById } from "../../../talk";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get("id"))
    const discordId = Number(url.searchParams.get("discordId"))

    if (id === null) {
        return {
            status: 404,
        }
    }
    return {
        status: 200,
        body: (id === NaN) ? await getUserByDiscordId(discordId) : await getUserById(id)
    }
}