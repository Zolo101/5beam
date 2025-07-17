import type { RequestHandler } from "@sveltejs/kit";
import { BAD, DENIED, isAdmin, OK, NOT_FOUND, MY_BAD, newlineSplitter } from "../../../../../misc";
import { ModifyLevelSchema, type ModifyLevelType } from "$lib/parse";
import { getLevelById, updateFetch } from "../../../../../talk/get";
import { levels } from "$lib/pocketbase";
import type { Level, PrivateBaseUserV2 } from "$lib/types";
import {
    ChangeDescriptionWebhook,
    ChangeDifficultyWebhook,
    ChangeLevelWebhook,
    ChangeTitleWebhook
} from "$lib/webhook";
import { generateThumbnail, validateLevel } from "../../../../../talk/create";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

export async function _modifyLevel(id: string, payload: ModifyLevelType, user: PrivateBaseUserV2) {
    const level = await getLevelById(id);
    if (!level) return NOT_FOUND();
    if (!level.creator) return DENIED(); // A Guest made this

    const allowed = user.id === level.creator.id || isAdmin(user);
    if (allowed) {
        const payloadFormData = new FormData();

        // Build payload form data
        if (payload.title !== undefined && level.title !== payload.title) {
            payloadFormData.append("title", payload.title);
            await ChangeTitleWebhook.send(payload.title, level);
        }
        if (payload.description !== undefined && level.description !== payload.description) {
            payloadFormData.append("description", payload.description);
            await ChangeDescriptionWebhook.send(payload.description, level);
        }
        if (payload.difficulty !== undefined && level.difficulty !== payload.difficulty) {
            payloadFormData.append("difficulty", payload.difficulty.toString());
            await ChangeDifficultyWebhook.send(payload.difficulty, level);
        }
        if (payload.modded !== undefined && level.modded !== payload.modded) {
            payloadFormData.append("modded", payload.modded);
        }
        if (payload.file !== undefined) {
            // TODO: Duplicate code (See misc.ts)
            const trimmedLevel = newlineSplitter(payload.file.trim())[0];
            if (!(await validateLevel(trimmedLevel))) throw new Error("Invalid level");

            payloadFormData.append("data", trimmedLevel);

            if (level.data !== trimmedLevel) {
                const thumbnail = await generateThumbnail(trimmedLevel);
                if (thumbnail) payloadFormData.append("thumbnail", await thumbnail.blob());
            }
            await ChangeLevelWebhook.send(undefined, level);
        }

        return OK(await updateFetch<Level>(levels, id, payloadFormData));
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
        const { user } = locals;
        if (!user) return DENIED();

        try {
            return _modifyLevel(id, payload, user);
        } catch {
            return MY_BAD();
        }
    } catch {
        return BAD();
    }
};
