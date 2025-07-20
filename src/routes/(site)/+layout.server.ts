import type { LayoutServerLoad } from "./$types";
import { isAdmin, isLoggedIn } from "$lib/misc";

export const load = (async ({ locals }) => {
    const user = locals?.user ?? undefined;

    const admin = isAdmin(user);
    const loggedIn = isLoggedIn(user);

    return { user, admin, loggedIn };
}) satisfies LayoutServerLoad;
