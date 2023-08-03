export {}
/*
import type { RequestHandler } from "@sveltejs/kit";
import { getLevelpackByProps } from "../../../talk/get";
import { return404 } from "../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get("id"))
    const includeLevels = url.searchParams.get("includeLevels")
    const includeLevelsData = url.searchParams.get("includeLevelsData")

    if (id === null) return return404() // Not Found

    return new Response(await getLevelpackByProps({ id }), {status: 200})
}
 */