import type { PageServerLoad } from "../../../../.svelte-kit/types/src/routes";
import { getUserByDiscordId } from "../../../talk/get";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
    const dbUser = await getUserByDiscordId(locals.user.id);

    const url = dbUser ? `/user/${dbUser.id}` : `/`;
    throw redirect(302, url);
}) satisfies PageServerLoad;
