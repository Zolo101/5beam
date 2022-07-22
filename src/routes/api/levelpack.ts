import type { RequestHandler } from "@sveltejs/kit";
import { getLevelpackByProps } from "../../talk/get";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get("id"))
    const includeLevels = url.searchParams.get("includeLevels")
    const includeLevelsData = url.searchParams.get("includeLevelsData")

    if (id === null) return {status: 404} // Not Found

    return {
        status: 200,
        body: await getLevelpackByProps({ id })
    }
}