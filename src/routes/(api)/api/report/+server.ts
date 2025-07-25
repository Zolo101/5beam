import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { NOT_FOUND, OK } from "$lib/server/misc";
import { reportKindById } from "$lib/talk/get";
import type { RequestHandler } from "./$types";

const schema = createObjectSchema("id", "reportKind", "reportReason", "reportDesc");
export const POST: RequestHandler = async ({ url }) => {
    try {
        const { id, reportKind, reportReason, reportDesc } = parseFromUrlSearchParams(schema, url);
        return OK(await reportKindById(id!, reportKind, reportReason, reportDesc));
    } catch {
        return NOT_FOUND();
    }
};
