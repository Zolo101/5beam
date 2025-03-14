import { OK } from "../../../../misc";
import { getWeeklyChallenge } from "../../../../talk/get";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    return OK(await getWeeklyChallenge());
};
