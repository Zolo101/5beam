import type { RequestHandler } from "@sveltejs/kit";
import { BAD, DENIED, isAdmin, OK, PostLevelSchema, NOT_FOUND, MY_BAD } from "../../../../../misc";
import { getLevelById, toPOJO, updateFetchFormData } from "../../../../../talk/get";
import { tryGettingUser } from "../../../../../talk/admin";
import { levels } from "$lib/pocketbase";
import type { Level } from "$lib/types";
import {
    ChangeDescriptionWebhook,
    ChangeDifficultyWebhook,
    ChangeLevelWebhook,
    ChangeTitleWebhook
} from "$lib/webhook";
import { generateThumbnail, newlineSplitter, validateLevel } from "../../../../../talk/create";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

// TODO: Investigate fetch in RequestHandler
const urlSchema = createObjectSchema("id");
const cookiesSchema = createObjectSchema("access_token", "refresh_token");
export const POST: RequestHandler = async ({ url, cookies, request }) => {
    try {
        const json = await request.json();
        const payload = PostLevelSchema.partial().parse(json);

        const { id } = parseFromUrlSearchParams(urlSchema, url);
        // TODO: Most definitely incorrect (cookies might not be an object)
        const { success, data } = cookiesSchema.safeParse(cookies);

        let access_token: string;
        let refresh_token: string;

        if (success) {
            access_token = data.access_token;
            refresh_token = data.refresh_token;
        } else {
            // Attempt to get tokens from request body (from other website etc)
            access_token = json.access_token;
            refresh_token = json.refresh_token;
        }

        // Get user from access token
        const user = await tryGettingUser(access_token, refresh_token, cookies);
        if (!user) return DENIED();

        try {
            const level = await getLevelById(id);
            if (!level) return NOT_FOUND(); // HOW??

            const allowed = user.id === level.creator.discordId || isAdmin(user);
            if (allowed) {
                const payloadFormData = new FormData();

                // Build payload form data
                if (payload.title !== undefined && level.title !== payload.title) {
                    payloadFormData.append("title", payload.title);
                    await ChangeTitleWebhook.send(payload.title, level);
                }
                if (
                    payload.description !== undefined &&
                    level.description !== payload.description
                ) {
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
                    const trimmedLevel = newlineSplitter(payload.file.trim())[0];
                    if (!(await validateLevel(trimmedLevel))) throw new Error("Invalid level");

                    payloadFormData.append("data", trimmedLevel);

                    if (level.data !== trimmedLevel) {
                        const thumbnail = await generateThumbnail(trimmedLevel);
                        if (thumbnail) payloadFormData.append("thumbnail", await thumbnail.blob());
                    }
                    await ChangeLevelWebhook.send(undefined, level);
                }

                const updatedLevel = await updateFetchFormData<Level>(levels, id, payloadFormData);
                return OK(toPOJO(updatedLevel));
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
