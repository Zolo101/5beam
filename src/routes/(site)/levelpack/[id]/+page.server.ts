import { error, type Actions } from "@sveltejs/kit";
import { getLevelpackByIdWithLevels } from "$lib/talk/get";
import type { PageServerLoad } from "./$types";
import { actions as levelActions } from "../../level/[id]/+page.server";

export const load: PageServerLoad = async ({ params }) => {
    const levelpack = await getLevelpackByIdWithLevels(params.id);
    if (!levelpack) {
        throw error(404, "Levelpack not found");
    }
    return { levelpack };
};

export const actions = {
    report: async (request) => {
        return levelActions.report(request);
    }
} satisfies Actions;
