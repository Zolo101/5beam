import type { RequestHandler } from "@sveltejs/kit";
import { getUserLevelpacks, getUserLevels } from "../../../../../talk/get";
import { BAD, OK, NOT_FOUND } from "../../../../../misc";

export const GET: RequestHandler = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const page = Number(url.searchParams.get("page") ?? 0);
    const type = Number(url.searchParams.get("type") ?? 0);
    const sort = Number(url.searchParams.get("sort") ?? 0);
    const featured = !!Number(url.searchParams.get("featured")) ?? false;
    const mod = url.searchParams.get("mod") ?? "";

    if (type < 0 || type >= 2) return BAD("Invalid type");
    const getFunc = type ? getUserLevelpacks : getUserLevels;

    if (sort < 0 || sort >= 3) return BAD("Invalid sort");
    if (id === null) return NOT_FOUND(); // Not Found

    return OK(await getFunc(id, page, sort, featured, mod));
};
