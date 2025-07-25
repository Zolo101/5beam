import { error, type Actions } from "@sveltejs/kit";
import { getUserById, getUserLevelpacks, getUserLevels } from "$lib/server/get";
import type { PageServerLoad } from "./$types";
import { actions as levelActions } from "../../level/[id]/+page.server";

export const load: PageServerLoad = async ({ params }) => {
    const [creator, levels, levelpacks] = await Promise.all([
        getUserById(params.id),
        getUserLevels(params.id, 0, 0, false, 8, "", { requestKey: null }),
        getUserLevelpacks(params.id, 0, 0, false, 8, "", { requestKey: null })
    ]);
    if (!creator) {
        throw error(404, "User not found");
    }
    return { creator, levels, levelpacks };
};

export const actions = {
    report: async (request) => {
        return levelActions.report(request);
    }
} satisfies Actions;
