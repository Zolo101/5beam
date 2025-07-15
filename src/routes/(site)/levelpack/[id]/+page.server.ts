import { error } from "@sveltejs/kit";
import { getLevelpackByIdWithLevels } from "../../../../talk/get";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const levelpack = await getLevelpackByIdWithLevels(params.id);
    if (!levelpack) {
        throw error(404, "Levelpack not found");
    }
    return { levelpack };
};
