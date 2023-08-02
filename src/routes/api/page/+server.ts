import type { RequestHandler } from "@sveltejs/kit";
import { getLevels } from "../../../talk/get";
import { OK } from "../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get("page"))
    const type = Number(url.searchParams.get("type") ?? 0)
    const sort = Number(url.searchParams.get("sort") ?? 0)
    const amount = Number(url.searchParams.get("amount") ?? 8)
    const includeData = url.searchParams.get("data") ?? false

    const offset = page * amount;
    // const getFunc = type ? getLevelpacks : getLevels;
    const featuredOnly = (type === 3) ? { featured: true } : {};

    let sortObj;
    switch (sort) {
        case 0:
        case 3:
            sortObj = {
                createdAt: "desc"
            }
            break;

        case 1:
            sortObj = {
                plays: "desc"
            }
            break;

        case 2:
            break;
    }

    // const result = await getFunc(page, amount, sortObj, featuredOnly);
    const result = await getLevels(page, amount, sortObj);
    return OK(result);
}