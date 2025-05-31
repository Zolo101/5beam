import type { RequestHandler } from "@sveltejs/kit";
import { addPlayLevel, addPlayLevelpack } from "../../../../talk/get";
import { BAD, OK } from "../../../../misc";

// TODO: Add better ratelimit
// pocketbase now has ratelimit so we *could* do this
export const GET: RequestHandler = async ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const type = Number(url.searchParams.get("type") ?? 0);

    const getFunc = type === 0 ? addPlayLevel : addPlayLevelpack;

    if (id === null) return BAD("No ID!"); // Not Found

    return OK(await getFunc(id));
};
