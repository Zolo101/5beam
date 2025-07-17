import type { RequestHandler } from "@sveltejs/kit";
import { BAD, DENIED, isAdmin, OK, NOT_FOUND, MY_BAD } from "$lib/misc";
import { ModifyLevelpackSchema } from "$lib/parse";
import { getLevelpackByIdWithLevels, updateFetch } from "$lib/talk/get";
import { levelpacks } from "$lib/pocketbase";
import type { Levelpack } from "$lib/types";
import { ChangeDescriptionWebhook, ChangeTitleWebhook } from "$lib/webhook";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { _modifyLevel } from "../level/+server";

const urlSchema = createObjectSchema("id");
export const POST: RequestHandler = async ({ url, request, locals }) => {
    return MY_BAD();

    try {
        const json = await request.json();
        const payload = ModifyLevelpackSchema.partial().parse(json);

        const { id } = parseFromUrlSearchParams(urlSchema, url);

        // Reminder, this is obtained using pb_auth cookie
        const { user } = locals;
        if (!user) return DENIED();

        try {
            const levelpack = await getLevelpackByIdWithLevels(id);
            if (!levelpack) return NOT_FOUND();
            if (!levelpack.creator) return DENIED(); // A Guest made this

            const allowed = user.id === levelpack.creator.id || isAdmin(user);
            if (allowed) {
                const payloadFormData = new FormData();

                // Build payload form data
                if (payload.title !== undefined && levelpack.title !== payload.title) {
                    payloadFormData.append("title", payload.title);
                    await ChangeTitleWebhook.send(payload.title, levelpack);
                }
                if (
                    payload.description !== undefined &&
                    levelpack.description !== payload.description
                ) {
                    payloadFormData.append("description", payload.description);
                    await ChangeDescriptionWebhook.send(payload.description, levelpack);
                }
                if (payload.modded !== undefined && levelpack.modded !== payload.modded) {
                    payloadFormData.append("modded", payload.modded);
                }

                if (payload.levels) {
                    Promise.allSettled(
                        payload.levels.map(async (level) => _modifyLevel(level.id, level, user))
                    );
                }

                return OK(await updateFetch<Levelpack>(levelpacks, id, payloadFormData));
            } else {
                return DENIED();
            }
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
