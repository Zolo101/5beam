import { getUserAllStarredItems } from "$lib/get.remote";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { user } }) => {
    if (!user) {
        throw error(404, "User not found");
    }

    const [starredLevels, starredLevelpacks] = await Promise.all([
        getUserAllStarredItems({ id: user?.record.id, type: 0, options: { requestKey: null } }),
        getUserAllStarredItems({ id: user?.record.id, type: 1, options: { requestKey: null } })
    ]);

    return { starredLevels, starredLevelpacks };
};
