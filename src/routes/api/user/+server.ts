// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getUserById } from "../../../talk/get";
import { return404 } from "../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    let id = url.searchParams.get("id")
    // TODO: To remove
    // const discordId = url.searchParams.get("discordId") ?? undefined

    if (id === null) return return404();

    let body = await getUserById(id)
    return new Response(body, {status: 200})
}