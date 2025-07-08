import { getDaily, getLevelpacks, getLevels } from "../../talk/get";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
    // { requestKey: null } to prevent autocancellation
    const [featuredLevels, mostPopularLevels, recentLevels, levelpacks, daily] = await Promise.all([
        getLevels(0, 0, true, "", 8, { requestKey: null }),
        getLevels(0, 2, false, "", 8, { requestKey: null }),
        getLevels(0, 0, false, "", 8, { requestKey: null }),
        getLevelpacks(0, 0, false, "", 8, { requestKey: null }),
        getDaily()
    ]);

    // const weekly = await getWeeklyChallenge();
    // return { recentLevels, featuredLevels, mostPopularLevels, levelpacks, daily, weekly };
    return { recentLevels, featuredLevels, mostPopularLevels, levelpacks, daily };
}) satisfies PageServerLoad;
