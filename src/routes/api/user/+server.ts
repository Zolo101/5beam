throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getUserByProps } from "../../../talk/get";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    let id = Number(url.searchParams.get("id"))
    const discordId = url.searchParams.get("discordId") ?? undefined

    if (id === 0 && discordId === undefined) return {status: 404};

    let body = (id === 0) ? await getUserByProps({ discordId }) : await getUserByProps({ id })
    return new Response(body, {status: 200})
}