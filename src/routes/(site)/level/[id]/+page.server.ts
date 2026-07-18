import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { hasUserStarred } from "$lib/stars.remote";
import { getLevelById, getRelatedLevels } from "$lib/get.remote";
import { ClientResponseError } from "pocketbase";
import { levels } from "$lib/clientPocketbase";

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const level = await levels.getOne(params.id, { expand: "creator" });
        // const relatedLevels = await getRelatedLevels(level);

        let starred = false;
        if (locals.user) {
            try {
                starred = await hasUserStarred({ id: params.id, type: 0 });
            } catch {
                // Not starred
            }
        }

        // return { level, starred, relatedLevels };
        return { level, starred };
    } catch (e) {
        if (e instanceof ClientResponseError && e.status === 404) {
            error(404, "Level not found");
        }

        throw error(500, "An internal error occurred while loading this level");
    }
};
