import { isAdmin } from "$lib/misc";
import { DENIED, MY_BAD, BAD, OK } from "$lib/server/misc";
import { fail, type Actions } from "@sveltejs/kit";
import { createObjectSchema } from "$lib/parse";
import { NewFeaturedWebhook } from "$lib/server/webhook";
import { adminPb } from "$lib/server/adminPocketbase";

async function featureLevel(levelId: string) {
    return adminPb.collection("5beam_levels").update(levelId, { featured: true });
}

async function addDailyLevel(levelId: string) {
    return adminPb.collection("5beam_dailyies").create({ level: levelId, featured: false });
}

const formSchema = createObjectSchema("id");
export const actions = {
    daily: async ({ locals, request }) => {
        try {
            const { id } = formSchema.parse(request.formData());

            const user = locals.user;
            if (!user) return DENIED();

            const allowed = isAdmin(user);
            if (!allowed) return DENIED();

            try {
                await addDailyLevel(id);
                return { success: true };
            } catch {
                return fail(500, { message: "Failed to add level to dailyies" });
            }
        } catch {
            return fail(400, { message: "Invalid data" });
        }
    },
    feature: async ({ locals, request }) => {
        try {
            const { id } = formSchema.parse(request.formData());

            const user = locals.user;
            if (!user) return DENIED();

            const allowed = isAdmin(user);
            if (!allowed) return DENIED();

            try {
                const level = await featureLevel(id);
                await NewFeaturedWebhook.send(level);
                return { success: true };
            } catch {
                return fail(500, { message: "Failed to feature level" });
            }
        } catch {
            return fail(400, { message: "Invalid data" });
        }
    }
} satisfies Actions;
