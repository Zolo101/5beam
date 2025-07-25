import { isAdmin } from "$lib/misc";
import { DENIED, MY_BAD, BAD, OK } from "$lib/server/misc";
import { addDailyLevel, featureLevel } from "$lib/talk/create";
import type { Actions } from "@sveltejs/kit";
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
                return OK();
            } catch {
                return MY_BAD("Failed to add level to dailyies");
            }
        } catch {
            return BAD();
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
                return OK();
            } catch {
                return MY_BAD("Failed to feature level");
            }
        } catch {
            return BAD();
        }
    }
} satisfies Actions;
