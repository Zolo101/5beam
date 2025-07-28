import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD, OK } from "$lib/server/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { adminPb } from "$lib/server/adminPocketbase";

async function addPlay(type: number, id: string) {
    const collection = type === 0 ? "5beam_levels" : "5beam_levelpacks";
    return await adminPb.collection(collection).update(id, { "plays+": 1 });
}

// TODO: Add better ratelimit
// pocketbase now has ratelimit so we *could* do this
const schema = createObjectSchema("id", "type");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id, type } = parseFromUrlSearchParams(schema, url);
        try {
            return OK(await addPlay(type, id));
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
