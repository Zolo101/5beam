import type { RequestHandler } from "@sveltejs/kit";
import { isAdmin } from "$lib/misc";
import { DENIED, MY_BAD, BAD, OK, NOT_FOUND } from "$lib/server/misc";
import { ModifyLevelSchema, type ModifyLevelType } from "$lib/parse";
import { getLevelById } from "$lib/get.remote";
import type { PrivateBaseUserV2 } from "$lib/types";
import {
    ChangeDescriptionWebhook,
    ChangeDifficultyWebhook,
    ChangeLevelWebhook,
    ChangeTitleWebhook
} from "$lib/server/webhook";
import { generateThumbnail, isLevelValid } from "$lib/talk/create";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import type Pocketbase from "pocketbase";

export async function _modifyLevel(
    id: string,
    payload: ModifyLevelType,
    user: PrivateBaseUserV2,
    pb: Pocketbase,
    silent: boolean = false
) {
    const level = await getLevelById(id);
    if (!level) return NOT_FOUND();
    if (!level.creator) return DENIED(); // A Guest made this

    const allowed = user.record.id === level.creator.id || isAdmin(user);
    if (allowed) {
        const payloadFormData = new FormData();

        // Build payload form data
        if (payload.title !== undefined && level.title !== payload.title) {
            payloadFormData.append("title", payload.title);
            if (!silent) await ChangeTitleWebhook.send(payload.title, level);
        }
        if (payload.description !== undefined && level.description !== payload.description) {
            payloadFormData.append("description", payload.description);
            if (!silent) await ChangeDescriptionWebhook.send(payload.description, level);
        }
        if (payload.difficulty !== undefined && level.difficulty !== payload.difficulty) {
            payloadFormData.append("difficulty", payload.difficulty.toString());
            if (!silent) await ChangeDifficultyWebhook.send(payload.difficulty, level);
        }
        if (payload.modded !== undefined && level.modded !== payload.modded) {
            payloadFormData.append("modded", payload.modded);
        }
        if (payload.file !== undefined) {
            // TODO: Duplicate code (See misc.ts)
            if (!isLevelValid(payload.file)) throw new Error("Invalid level");

            payloadFormData.append("data", payload.file);

            if (level.data !== payload.file) {
                // Unfortunately sometimes the generateThumbnail can give a 500 in specific cases
                // in those cases we will simply remove the thumbnail since it is outdated.
                const thumbnail = await generateThumbnail(payload.file);

                if (thumbnail.ok) {
                    payloadFormData.append("thumbnail", await thumbnail.blob());
                } else {
                    payloadFormData.append("thumbnail", "");
                }
            }
            if (!silent) await ChangeLevelWebhook.send(undefined, level);
        }

        return OK(await pb.collection("5beam_levels").update(id, payloadFormData));
    } else {
        return DENIED();
    }
}

const urlSchema = createObjectSchema("id");
export const POST: RequestHandler = async ({ url, request, locals }) => {
    try {
        const json = await request.json();
        const payload = ModifyLevelSchema.parse(json);

        const { id } = parseFromUrlSearchParams(urlSchema, url);

        // Reminder, this is obtained using pb_auth cookie
        const { pb, user } = locals;
        if (!user) return DENIED();

        try {
            return _modifyLevel(id, payload, user, pb);
        } catch {
            return MY_BAD();
        }
    } catch (e) {
        console.error(e);
        return BAD();
    }
};
