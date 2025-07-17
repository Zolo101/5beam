import { redirect, type RequestHandler } from "@sveltejs/kit";
import { BAD, isLoggedIn } from "$lib/misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { actions } from "../+page.server";

const schema = createObjectSchema("redirectURI");
export const GET: RequestHandler = async (event) => {
    const { url, locals } = event;
    const { user } = locals;
    const { redirectURI } = parseFromUrlSearchParams(schema, url);

    if (!redirectURI) {
        return BAD("No redirectURI provided");
    }

    // if (isLoggedIn(user)) {
    // throw redirect(302, redirectURI);
    // } else {
    // }
    return actions.default(event);
};
