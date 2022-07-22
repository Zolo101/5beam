import type { RequestHandler } from "@sveltejs/kit";
import { getLevelpacks, getLevels } from "../../talk/get";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page"))
    const type = Number(url.searchParams.get("type") ?? 0)
    const sort = Number(url.searchParams.get("sort") ?? 0)
    const amount = Number(url.searchParams.get("amount") ?? 8)
    const includeData = url.searchParams.get("data") ?? false

    const offset = page * amount;
    const getFunc = type ? getLevelpacks : getLevels;

    return {
        status: 200,
        body: await getFunc(amount, offset)
    }
}