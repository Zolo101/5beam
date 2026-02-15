import {
    getDaily,
    getLevelpacks,
    getLevels,
    getTrendingLevels,
    getUserAllStarredItems
} from "$lib/get.remote";
import type { PageServerLoad } from "./$types";

// TODO: Revamp this whole function to use remote functions namely query.batch
export const load = (async ({ locals }) => {
    const { user } = locals;

    // { requestKey: null } to prevent autocancellation with paging
    // const [featuredLevels, trendingLevels, recentLevels, levelpacks, daily] = await Promise.all([
    // const [trendingLevels, levelpacks] = await Promise.all([
    // getLevels({
    //     page: 1,
    //     sortCode: 0,
    //     featured: true,
    //     mod: "",
    //     amount: 8,
    //     options: { requestKey: null }
    // }),
    // getTrendingLevels(0, 8, "", { requestKey: null }),
    // getLevels({
    //     page: 1,
    //     sortCode: 0,
    //     featured: false,
    //     mod: "",
    //     amount: 8,
    //     options: { requestKey: null }
    // }),
    // getLevelpacks(0, 0, false, "", 8, { requestKey: null })
    // getDaily()
    // ]);
    // const weekly = await getWeeklyChallenge();

    // if (user) {
    //     const [starredLevels, starredLevelpacks] = await Promise.all([
    //         getUserAllStarredItems(user?.record.id, 0),
    //         getUserAllStarredItems(user?.record.id, 1)
    //     ]);

    //     return {
    //         // recentLevels,
    //         // featuredLevels,
    //         // trendingLevels,
    //         // levelpacks,
    //         // daily,
    //         starredLevels,
    //         starredLevelpacks
    //     };
    // }

    // return {
    //     // recentLevels,
    //     // featuredLevels,
    //     // trendingLevels,
    //     // levelpacks,
    //     // daily
    // };
}) satisfies PageServerLoad;
