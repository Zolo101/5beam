import type { RequestHandler } from "@sveltejs/kit";
import { getUserByProps } from "../../../talk/get";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    let id = Number(url.searchParams.get("id"))
    const discordId = url.searchParams.get("discordId") ?? undefined

    if (id === 0 && discordId === undefined) return {status: 404};

    return {
        status: 200,
        body: (id === 0) ? await getUserByProps({ discordId }) : await getUserByProps({ id })
    }
}