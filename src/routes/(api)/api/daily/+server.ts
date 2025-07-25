import { OK } from "$lib/server/misc";
import { getDaily } from "$lib/server/get";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    return OK(await getDaily());
};
