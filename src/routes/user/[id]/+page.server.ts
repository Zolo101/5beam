import type { PageServerLoad } from "./$types";
import { getUserById, getUserLevelpacks, getUserLevels } from "../../../talk/get";

export const load = (async ({ params }) => {
    const creator = await getUserById(params.id);
    const levels = await getUserLevels(params.id, 0)
    const levelpacks = await getUserLevelpacks(params.id, 0)
    return {creator, levels, levelpacks}
}) satisfies PageServerLoad;