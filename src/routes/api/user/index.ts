import type { RequestHandler } from "@sveltejs/kit";
import { getUserByDiscordId, getUserById } from "../../../talk";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get("id"))
    const discordId = url.searchParams.get("discordId") ?? ""

    if (id === null) {
        return {
            status: 404,
        }
    }
    return {
        status: 200,
        // TODO: apparently this will always be false? "=== NaN"
        body: (id === NaN) ? await getUserByDiscordId(discordId) : await getUserById(id)
    }
}