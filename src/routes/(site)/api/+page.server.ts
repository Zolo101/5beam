import { getLevelById, getLevelpackById, getUserById } from "$lib/get.remote";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
    const level = await getLevelById("1fck6fch07q3m0i");
    const levelpack = await getLevelpackById("najny189ht21n9z");
    const user = await getUserById("m44nvxs3tjoqor0");
    return { level, levelpack, user };
}) satisfies PageServerLoad;
