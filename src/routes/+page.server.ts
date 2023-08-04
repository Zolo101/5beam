import { getLevelpacks, getLevels } from "../talk/get";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
    const levels = await getLevels(0, null, null);
    const levelpacks = await getLevelpacks(0, null, null);
    return {levels, levelpacks}
}) satisfies PageServerLoad;