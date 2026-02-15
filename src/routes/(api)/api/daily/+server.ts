import { OK } from "$lib/server/misc";
import { getDaily } from "$lib/get.remote";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    return OK(await getDaily());
};
