import { OK } from "$lib/misc";
import { getWeeklyChallenge } from "$lib/talk/get";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    return OK(await getWeeklyChallenge());
};
