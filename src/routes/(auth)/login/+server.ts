import type { RequestHandler } from "@sveltejs/kit";
import { actions } from "./+page.server";

export const POST: RequestHandler = async (r) => {
    return actions.default(r);
};
