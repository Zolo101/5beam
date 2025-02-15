import type { PageServerLoad } from "./$types";
import { getRandomLevels } from "../../talk/get";

export const load = (async () => {
    const randomLevels = await getRandomLevels(16, 0, false, "");
    return { randomLevels };
}) satisfies PageServerLoad;
