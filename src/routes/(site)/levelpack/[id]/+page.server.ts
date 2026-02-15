import { type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { actions as levelActions } from "../../level/[id]/+page.server";
import { hasUserStarred } from "$lib/stars.remote";
import { getLevelpackByIdWithLevels } from "$lib/get.remote";

export const load: PageServerLoad = async ({ params, locals }) => {
    const levelpack = await getLevelpackByIdWithLevels(params.id);

    let starred = false;
    if (locals.user) {
        try {
            starred = await hasUserStarred({ id: params.id, type: 1 });
        } catch {
            // Not starred
        }
    }

    return { levelpack, starred };
};

export const actions = {
    report: async (request) => {
        return levelActions.report(request);
    }
} satisfies Actions;
