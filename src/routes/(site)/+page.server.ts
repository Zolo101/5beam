import {
    getDaily,
    getLevelById,
    getLevelpackById,
    getLevelpacks,
    getLevels,
    getTrendingLevels,
    getUserAllStarredItems,
    getUserById
} from "$lib/get.remote";
import type { PageServerLoad } from "./$types";

// TODO: Revamp this whole function to use remote functions namely query.batch
export const load = (async ({ locals }) => {
    const { user } = locals;

    const nominatedLevels = Promise.all([
        getLevelById("afmhnp31p8v5vz3"),
        getLevelById("6zh9v1w8tnxl15c"),
        getLevelById("7w86ww1n3ojevat"),
        getLevelById("c9eg2t801v7fdc0"),
        getLevelById("6xum2ro9qyl74j8")
    ]);
    const nominatedLevelpacks = Promise.all([
        getLevelpackById("a1x6jhja651v735"),
        getLevelpackById("w0ltryrnb62jzmu"),
        getLevelpackById("vmyosbhsac3jb0q"),
        getLevelpackById("7s350d362sa4xbh")
    ]);

    const meanieTweezie = await getUserById("8far9ghoqjtyqii");

    return {
        nominatedLevels: await nominatedLevels,
        nominatedLevelpacks: await nominatedLevelpacks,
        meanieTweezie
    };

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
