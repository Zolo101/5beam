import { error } from "@sveltejs/kit";
import { getLevelById } from "../../../../talk/get";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const level = await getLevelById(params.id);
    if (!level) {
        throw error(404, "Level not found");
    }
    return { level };
};
