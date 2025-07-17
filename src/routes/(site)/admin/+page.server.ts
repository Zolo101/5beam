import { DENIED, isAdmin, MY_BAD, BAD, OK } from "$lib/misc";
import { addDailyLevel, featureLevel } from "$lib/talk/create";
import type { Actions } from "@sveltejs/kit";
import { createObjectSchema } from "$lib/parse";
import { NewFeaturedWebhook } from "$lib/webhook";

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
