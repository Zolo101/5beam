import type { PageServerLoad } from "./$types";
import { getLevelById } from "../../../talk/get";

export const load = (async ({ params }) => {
    const level = await getLevelById(params.id);
    return {level}
}) satisfies PageServerLoad;