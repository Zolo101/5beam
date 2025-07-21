import { error } from "@sveltejs/kit";
import { getLevelById, getRelatedLevels } from "$lib/talk/get";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const level = await getLevelById(params.id);

    const relatedLevels = await getRelatedLevels(level);

    if (!level) {
        throw error(404, "Level not found");
    }
    return { level, relatedLevels };
};
