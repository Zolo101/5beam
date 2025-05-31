import { error } from "@sveltejs/kit";
import { getLevelpackById } from "../../../../talk/get";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const levelpack = await getLevelpackById(params.id);
    if (!levelpack) {
        throw error(404, "Levelpack not found");
    }
    return { levelpack };
};
