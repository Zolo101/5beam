import type { RequestHandler } from "@sveltejs/kit";
import { getSearch } from "../../talk/get";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const text = url.searchParams.get("text") ?? ""
    const amount = Number(url.searchParams.get("amount") ?? 8)

    return {
        status: 200,
        body: await getSearch(text, amount)
    }
}