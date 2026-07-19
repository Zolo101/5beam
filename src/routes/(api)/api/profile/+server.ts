import { DENIED, MY_BAD, OK } from "$lib/server/misc";
import { getUserById } from "$lib/get.remote";
import type { RequestHandler } from "./$types";

// This gives the public user not private
export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.user) return DENIED();
    try {
        const user = await getUserById(locals.user.record.id);
        // we gotta give the token via response body since cross origin cookies are BURNT thanks to advertisers #web4.0
        return OK({ ...user, token: locals.pb.authStore.token });
    } catch (e) {
        console.error(e);
        return MY_BAD();
    }
};
