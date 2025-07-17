import { OK } from "../../../../misc";
import { getDaily } from "../../../../talk/get";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    return OK(await getDaily());
};
