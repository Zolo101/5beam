import type { RequestHandler } from "@sveltejs/kit";
import { getUserLevels } from "../../../talk/get";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const creatorId = Number(url.searchParams.get("creatorId"))
    const page = Number(url.searchParams.get("page"))
    const sort = Number(url.searchParams.get("sort") ?? 0)
    const amount = Number(url.searchParams.get("amount") ?? 16)
    const includeData = url.searchParams.get("data") ?? false

    const offset = page * amount;

    return {
        status: 200,
        body: await getUserLevels({ creatorId }, amount, offset)
    }
}