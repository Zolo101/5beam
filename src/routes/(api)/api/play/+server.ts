import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { adminPb } from "$lib/adminPocketbase";

async function addPlayLevel(id: string) {
    return await adminPb.collection("5beam_levels").update(id, { "plays+": 1 });
}

async function addPlayLevelpack(id: string) {
    return await adminPb.collection("5beam_levelpacks").update(id, { "plays+": 1 });
}

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
