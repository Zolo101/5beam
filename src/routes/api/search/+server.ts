// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getSearch } from "../../../talk/get";
import { OK } from "../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const text = url.searchParams.get("text") ?? ""
    const amount = Number(url.searchParams.get("amount") ?? 8)

    return OK(await getSearch(text, amount))
}