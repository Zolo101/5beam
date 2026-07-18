import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { actions as levelActions } from "../../level/[id]/+page.server";
import { hasUserStarred } from "$lib/stars.remote";
import { getLevelpackByIdWithLevels } from "$lib/get.remote";
import { levelpacks } from "$lib/clientPocketbase";
import { ClientResponseError } from "pocketbase";

export const load: PageServerLoad = async ({ params, locals }) => {
    try {
        const levelpack = await levelpacks.getOne(params.id, {
            expand: "creator,levels,levels.creator"
        });

        let starred = false;
        if (locals.user) {
            try {
                starred = await hasUserStarred({ id: params.id, type: 1 });
            } catch {
                // Not starred
            }
        }

        return { levelpack, starred };
    } catch (e) {
        if (e instanceof ClientResponseError && e.status === 404) {
            error(404, "Levelpack not found");
        }

        throw error(500, "An internal error occurred while loading this levelpack");
    }
};
