import type { RequestHandler } from "@sveltejs/kit";
import { getLevels } from "../../talk";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page"))
    const sort = Number(url.searchParams.get("sort") ?? 0)
    const amount = Number(url.searchParams.get("amount") ?? 8)
    const includeData = url.searchParams.get("data") ?? false

    const offset = page * amount;

    return {
        status: 200,
        body: await getLevels(amount, offset)
    }
}