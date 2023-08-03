import type { RequestHandler } from "@sveltejs/kit";
import { getUserLevels } from "../../../../talk/get";
import { OK, return404 } from "../../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const creatorId = url.searchParams.get("creatorId")
    const page = Number(url.searchParams.get("page"))
    const type = Number(url.searchParams.get("type") ?? 0)
    const sort = Number(url.searchParams.get("sort") ?? 0)
    const amount = Number(url.searchParams.get("amount") ?? 16)
    const includeData = url.searchParams.get("data") ?? false

    const offset = page * amount;
    // const getFunc = type ? getUserLevelpacks : getUserLevels;
    const getFunc = getUserLevels;

    if (creatorId === null) return return404() // Not Found

    return OK(await getFunc(creatorId, page))
}