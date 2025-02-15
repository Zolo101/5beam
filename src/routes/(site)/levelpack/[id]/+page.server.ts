import type { PageServerLoad } from "../../../../../.svelte-kit/types/src/routes";
import { getLevelpackById } from "../../../../talk/get";

export const load = (async ({ params }) => {
    const levelpack = await getLevelpackById(params.id);
    return { levelpack };
}) satisfies PageServerLoad;
