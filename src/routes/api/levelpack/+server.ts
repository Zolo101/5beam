throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getLevelpackByProps } from "../../../talk/get";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get("id"))
    const includeLevels = url.searchParams.get("includeLevels")
    const includeLevelsData = url.searchParams.get("includeLevelsData")

    if (id === null) return {status: 404} // Not Found

    return new Response(await getLevelpackByProps({ id }), {status: 200})
}