import { getDaily, getLevelpacks, getLevels, getWeeklyChallenge } from "../../talk/get";
import type { PageServerLoad } from "../../../.svelte-kit/types/src/routes";

export const load = (async () => {
    // { requestKey: null } to prevent autocancellation
    const [featuredLevels, mostPopularLevels, recentLevels, levelpacks, daily] = await Promise.all([
        getLevels(0, 0, true, "", { requestKey: null }),
        getLevels(0, 2, false, "", { requestKey: null }),
        getLevels(0, 0, false, "", { requestKey: null }),
        getLevelpacks(0, 0, false, "", { requestKey: null }),
        getDaily()
    ]);

    // const weekly = await getWeeklyChallenge();
    // return { recentLevels, featuredLevels, mostPopularLevels, levelpacks, daily, weekly };
    return { recentLevels, featuredLevels, mostPopularLevels, levelpacks, daily };
}) satisfies PageServerLoad;
