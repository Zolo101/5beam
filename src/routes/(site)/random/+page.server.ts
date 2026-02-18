import type { PageServerLoad } from "./$types";
// import { getRandomLevels } from "$lib/get.remote";
// import type { Level } from "$lib/types";

export const load = (async () => {
    // const randomLevels = (await getRandomLevels(12, 0, false, "")) as Level[];
    // return { randomLevels };
}) satisfies PageServerLoad;
