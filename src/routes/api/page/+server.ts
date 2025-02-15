import type { RequestHandler } from "@sveltejs/kit";
import { getLevelpacks, getLevels } from "../../../talk/get";
import { BAD, OK } from "../../../misc";

export const GET: RequestHandler = async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page"));
    const type = Number(url.searchParams.get("type") ?? 0);
    const sort = Number(url.searchParams.get("sort") ?? 0);
    const featured = !!Number(url.searchParams.get("featured")) ?? false;
    const mod = url.searchParams.get("mod") ?? "";

    if (type < 0 || type >= 2) return BAD("Invalid type");
    const getFunc = type === 0 ? getLevels : getLevelpacks;

    if (sort < 0 || sort >= 3) return BAD("Invalid sort");

    return OK(await getFunc(page, sort, featured, mod));
};
