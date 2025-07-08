import type { RequestHandler } from "@sveltejs/kit";
import { addPlayLevel, addPlayLevelpack } from "../../../../talk/get";
import { BAD, MY_BAD, OK } from "../../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

// TODO: Add better ratelimit
// pocketbase now has ratelimit so we *could* do this
const schema = createObjectSchema("id", "type");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, type } = parseFromUrlSearchParams(schema, url);
        try {
            const getFunc = type === 0 ? addPlayLevel : addPlayLevelpack;
            return OK(await getFunc(id));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
