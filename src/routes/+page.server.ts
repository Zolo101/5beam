import { getLevelpacks, getLevels } from "../talk/get";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
    const featuredLevels = await getLevels(0, 1, true);
    const mostPopularLevels = await getLevels(0, 2, false);
    const recentLevels = await getLevels(0, 0, false);
    const levelpacks = await getLevelpacks(0, 0, false);
    return {recentLevels, featuredLevels, mostPopularLevels, levelpacks}
}) satisfies PageServerLoad;