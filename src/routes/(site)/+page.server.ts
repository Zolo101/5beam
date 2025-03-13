import { getDaily, getLevelpacks, getLevels, getWeeklyChallenge } from "../../talk/get";
import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes";

export const load = (async () => {
    const featuredLevels = await getLevels(0, 0, true, "");
    const mostPopularLevels = await getLevels(0, 2, false, "");
    const recentLevels = await getLevels(0, 0, false, "");
    const levelpacks = await getLevelpacks(0, 0, false, "");

    const daily = await getDaily();
    // const weekly = await getWeeklyChallenge();
    // return { recentLevels, featuredLevels, mostPopularLevels, levelpacks, daily, weekly };
    return { recentLevels, featuredLevels, mostPopularLevels, levelpacks, daily };
}) satisfies PageServerLoad;
