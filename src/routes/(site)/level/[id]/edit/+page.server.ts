import type { PageServerLoad } from "./$types";
import { getLevelById } from "../../../../../talk/get";

export const load = (async ({ params, cookies }) => {
    const level = await getLevelById(params.id);
    const access_token = cookies.get("access_token");
    return { level, access_token };
}) satisfies PageServerLoad;
