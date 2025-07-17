import type { PageServerLoad } from "./$types";
import { getUserById } from "../../../talk/get";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
    const dbUser = await getUserById(locals.user.id);

    const url = dbUser ? `/user/${dbUser.id}` : `/`;
    throw redirect(302, url);
}) satisfies PageServerLoad;
