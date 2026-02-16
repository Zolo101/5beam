import type { RequestHandler } from "@sveltejs/kit";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { DENIED, NOT_FOUND } from "$lib/server/misc";
import { operateStar } from "$lib/stars.remote";

const schema = createObjectSchema("id");
export const POST: RequestHandler = async ({ url, locals }) => {
    try {
        const { id } = parseFromUrlSearchParams(schema, url);

        const { user } = locals;
        if (!user) return DENIED();

        const { starred } = await operateStar({ id, type: 0 });
        return new Response(JSON.stringify({ starred }));
    } catch {
        return NOT_FOUND();
    }
};
