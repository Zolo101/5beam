import type { PageServerLoad } from "../../../../.svelte-kit/types/src/routes";
import { getRandomLevels } from "../../../talk/get";

export const load = (async () => {
    const randomLevels = await getRandomLevels(12, 0, false, "");
    return { randomLevels };
}) satisfies PageServerLoad;
