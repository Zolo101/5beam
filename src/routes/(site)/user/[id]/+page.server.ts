import { error } from "@sveltejs/kit";
import { getUserById, getUserLevelpacks, getUserLevels } from "../../../../talk/get";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
    const [creator, levels, levelpacks] = await Promise.all([
        getUserById(params.id),
        getUserLevels(params.id, 0, 0, false, 8, "", { requestKey: null }),
        getUserLevelpacks(params.id, 0, 0, false, 8, "", { requestKey: null })
    ]);
    if (!creator) {
        throw error(404, "User not found");
    }
    return { creator, levels, levelpacks };
};
