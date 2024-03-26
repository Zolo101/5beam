import type { PageServerLoad } from "./$types";
import { getUserById, getUserLevelpacks, getUserLevels } from "../../../talk/get";

export const load = (async ({ params }) => {
    const creator = await getUserById(params.id);
    const levels = await getUserLevels(params.id, 0, 0, false, "")
    const levelpacks = await getUserLevelpacks(params.id, 0, 1, false, "")
    return {creator, levels, levelpacks}
}) satisfies PageServerLoad;