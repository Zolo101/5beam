import type { RequestHandler } from "@sveltejs/kit";
import { getLevels } from "../../talk";

export const get: RequestHandler = async ({params}) => {
    const page = Number(params.page)
    const sort = Number(params.page ?? 0)
    const amount = Number(params.page ?? 8)
    const includeData = params.data ?? false

    return {
        status: 200,
        body: await getLevels()
    }
}