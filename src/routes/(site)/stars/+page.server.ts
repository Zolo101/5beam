import { getUserAllStarredItems } from "$lib/get.remote";
import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { user } }) => {
    if (!user) {
        throw error(404, "User not found");
    }

    const [starredLevels, starredLevelpacks] = await Promise.all([
        getUserAllStarredItems(user?.record.id, 0, { requestKey: null }),
        getUserAllStarredItems(user?.record.id, 1, { requestKey: null })
    ]);

    return { starredLevels, starredLevelpacks };
};
