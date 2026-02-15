import { error, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { actions as levelActions } from "../../level/[id]/+page.server";
import { getUserById, getUserLevels, getUserLevelpacks } from "$lib/get.remote";

export const load: PageServerLoad = async ({ params }) => {
    const [creator, levels, levelpacks] = await Promise.all([
        getUserById(params.id),
        getUserLevels({
            id: params.id,
            page: 1,
            sortCode: 0,
            amount: 8,
            mod: "",
            options: { requestKey: null }
        }),
        getUserLevelpacks({
            id: params.id,
            page: 1,
            sortCode: 0,
            amount: 8,
            mod: "",
            options: { requestKey: null }
        })
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
