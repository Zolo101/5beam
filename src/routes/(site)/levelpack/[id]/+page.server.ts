import { type Actions } from "@sveltejs/kit";
import { getLevelpackByIdWithLevels } from "$lib/server/get";
import type { PageServerLoad } from "./$types";
import { actions as levelActions } from "../../level/[id]/+page.server";

export const load: PageServerLoad = async ({ params }) => {
    const levelpack = await getLevelpackByIdWithLevels(params.id);
    return { levelpack };
};

export const actions = {
    report: async (request) => {
        return levelActions.report(request);
    }
} satisfies Actions;
