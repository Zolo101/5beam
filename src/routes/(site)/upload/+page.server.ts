import type { PageServerLoad } from "../../../../.svelte-kit/types/src/routes";

export const load = (async ({ cookies }) => {
    return { access_token: cookies.get("access_token") };
}) satisfies PageServerLoad;
