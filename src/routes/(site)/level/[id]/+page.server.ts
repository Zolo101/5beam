import { type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { createObjectSchema } from "$lib/parse";
import { hasUserStarred } from "$lib/stars.remote";
import { getLevelById, getRelatedLevels } from "$lib/get.remote";
import { reportKindById } from "$lib/create.remote";

export const load: PageServerLoad = async ({ params, locals }) => {
    const level = await getLevelById(params.id);
    const relatedLevels = await getRelatedLevels(level);

    let starred = false;
    if (locals.user) {
        try {
            starred = await hasUserStarred({ id: params.id, type: 0 });
        } catch {
            // Not starred
        }
    }

    return { level, starred, relatedLevels };
};
