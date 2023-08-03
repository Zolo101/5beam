import {getLevels} from "../talk/get";
import type {PageServerLoad} from "./$types";

export const load = (async ({ params }) => {
    const levels = await getLevels(0, null, null);
    return {levels}
}) satisfies PageServerLoad;