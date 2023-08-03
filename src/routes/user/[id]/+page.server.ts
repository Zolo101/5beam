import type {PageServerLoad} from "./$types";
import {getUserById, getUserLevels} from "../../../talk/get";

export const load = (async ({ params }) => {
    const creator = await getUserById(params.id);
    const levels = await getUserLevels(params.id, 0)
    return {creator, levels}
}) satisfies PageServerLoad;