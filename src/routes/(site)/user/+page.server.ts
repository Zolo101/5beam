import type { PageServerLoad } from "./$types";
import { getUserById } from "$lib/server/get";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
    const dbUser = await getUserById(locals.user.record.id);

    const url = dbUser ? `/user/${dbUser.id}` : `/`;
    throw redirect(302, url);
}) satisfies PageServerLoad;
