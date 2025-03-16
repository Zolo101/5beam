import type { RequestHandler } from "@sveltejs/kit";
import { OK, NOT_FOUND } from "../../../../misc";
import { getLevelpackById, getLevelpackByIdWithLevels } from "../../../../talk/get";

export const GET: RequestHandler = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const levels = Number(url.searchParams.get("levels") ?? 0);

    if (id === null) return NOT_FOUND(); // Not Found

    const getFunc = levels ? getLevelpackByIdWithLevels : getLevelpackById;

    return OK(await getFunc(id));
};
