import type { LayoutServerLoad } from "./$types";
import { isAdmin, isLoggedIn } from "$lib/misc";

export const load = (async ({ locals }) => {
    const { record } = locals?.user ?? {};

    const admin = isAdmin(record);
    const loggedIn = isLoggedIn(record);

    return { user: record, admin, loggedIn };
}) satisfies LayoutServerLoad;
