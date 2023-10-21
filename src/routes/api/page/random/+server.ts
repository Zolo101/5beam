import type { RequestHandler } from "@sveltejs/kit";
import { getRandomLevels } from "../../../../talk/get";
import { BAD, OK } from "../../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const amount = Number(url.searchParams.get("amount") ?? 8)
    const type = Number(url.searchParams.get("type") ?? 0)
    const featured = !!Number(url.searchParams.get("featured")) ?? false
    const mod = url.searchParams.get("mod") ?? ""

    if (type < 0 || type >= 2) return BAD("Invalid type")
    if (amount < 0 || amount > 16) return BAD("Invalid amount")

    return OK(await getRandomLevels(amount, type, featured, mod));
}