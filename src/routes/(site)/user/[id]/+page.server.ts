import type { PageServerLoad } from "../../../../../.svelte-kit/types/src/routes";
import { getUserById, getUserLevelpacks, getUserLevels } from "../../../../talk/get";

export const load = (async ({ params }) => {
    const [creator, levels, levelpacks] = await Promise.all([
        getUserById(params.id),
        getUserLevels(params.id, 0, 0, false, "", { requestKey: null }),
        getUserLevelpacks(params.id, 0, 1, false, "", { requestKey: null })
    ]);
    return { creator, levels, levelpacks };
}) satisfies PageServerLoad;
