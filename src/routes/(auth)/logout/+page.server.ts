import type { Actions } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ locals }) => {
        locals.pb.authStore.clear();

        throw redirect(302, "/");
    }
} satisfies Actions;
