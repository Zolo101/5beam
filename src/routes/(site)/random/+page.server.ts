import type { PageServerLoad } from "./$types";
import { getRandomLevels } from "../../../talk/get";
import { error } from "@sveltejs/kit";
import type { Level } from "$lib/types";

export const load = (async () => {
    const randomLevels = (await getRandomLevels(12, 0, false, "")) as Level[];
    if (!randomLevels) {
        throw error(500, "Could not get random levels");
    }
    return { randomLevels };
}) satisfies PageServerLoad;
