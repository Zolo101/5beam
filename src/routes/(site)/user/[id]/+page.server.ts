import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { ClientResponseError } from "pocketbase";
import { usersV2 } from "$lib/clientPocketbase";

export const load: PageServerLoad = async ({ params }) => {
    try {
        const creator = await usersV2.getOne(params.id);
        return { creator };
    } catch (e) {
        if (e instanceof ClientResponseError && e.status === 404) {
            error(404, "User not found");
        }

        throw error(500, "An internal error occurred while loading this user");
    }
};
