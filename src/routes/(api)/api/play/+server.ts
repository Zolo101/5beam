import type { RequestHandler } from "@sveltejs/kit";
import { getLevelById, getLevelpackById } from "$lib/talk/get";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { adminPb } from "$lib/adminPocketbase";

async function addPlayLevel(id: string) {
    const result = await getLevelById(id);
    await adminPb.collection("5beam_levels").update(id, { plays: result.plays + 1 });

    return result;
}

async function addPlayLevelpack(id: string) {
    const result = await getLevelpackById(id);
    await adminPb.collection("5beam_levelpacks").update(id, { plays: result.plays + 1 });

    return result;
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
