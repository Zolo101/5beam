import type { RequestHandler } from "@sveltejs/kit";
import { getSearch } from "../../../talk/get";
import { OK } from "../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const text = url.searchParams.get("text") ?? ""
    const page = Number(url.searchParams.get("page") ?? 0)
    const mod = url.searchParams.get("mod") ?? ""

    return OK(await getSearch(text, page, mod))
}