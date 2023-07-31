// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getSearch } from "../../../talk/get";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const text = url.searchParams.get("text") ?? ""
    const amount = Number(url.searchParams.get("amount") ?? 8)

    return new Response(await getSearch(text, amount), {status: 200})
}