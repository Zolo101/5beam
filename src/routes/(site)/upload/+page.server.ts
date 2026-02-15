import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, "/login");
    }

    // return locals.;
}) satisfies PageServerLoad;
