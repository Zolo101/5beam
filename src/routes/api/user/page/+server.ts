throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getUserLevelpacks, getUserLevels } from "../../../../talk/get";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const creatorId = Number(url.searchParams.get("creatorId"))
    const page = Number(url.searchParams.get("page"))
    const type = Number(url.searchParams.get("type") ?? 0)
    const sort = Number(url.searchParams.get("sort") ?? 0)
    const amount = Number(url.searchParams.get("amount") ?? 16)
    const includeData = url.searchParams.get("data") ?? false

    const offset = page * amount;
    const getFunc = type ? getUserLevelpacks : getUserLevels;

    return new Response(await getFunc({creatorId}, amount, offset), {status: 200})
}