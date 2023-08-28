import type { RequestHandler } from "@sveltejs/kit";
import { getUserLevelpacks, getUserLevels } from "../../../../talk/get";
import { BAD, OK, return404 } from "../../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    const type = Number(url.searchParams.get("type") ?? 0)
    const sort = Number(url.searchParams.get("sort") ?? 0)
    const featured = Boolean(url.searchParams.get("data")) ?? false
    const mod = url.searchParams.get("mod") ?? ""

    if (type < 0 || type >= 2) return BAD("Invalid type")
    const getFunc = type ? getUserLevelpacks : getUserLevels;

    if (sort < 0 || sort >= 2) return BAD("Invalid sort")
    if (id === null) return return404() // Not Found

    return OK(await getFunc(id, sort, featured, mod))
}