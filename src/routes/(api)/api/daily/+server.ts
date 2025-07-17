import { OK } from "$lib/misc";
import { getDaily } from "$lib/talk/get";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    return OK(await getDaily());
};
