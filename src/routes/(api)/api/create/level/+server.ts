import type { RequestHandler } from "@sveltejs/kit";
import { BAD, MY_BAD, OK } from "$lib/misc";
import { type PostLevelType } from "$lib/parse";
import { PostLevelSchema } from "$lib/parse";
import { generateThumbnail, isLevelValid } from "$lib/talk/create";
import { levels } from "$lib/clientPocketbase";
import type { Level, PrivateBaseUserV2 } from "$lib/types";
import { NewLevelWebhook } from "$lib/webhook";

export async function _createLevel(
    level: PostLevelType,
    user: PrivateBaseUserV2 | null,
    silent: boolean = false
) {
    // If it's not modded, validate again, and if so throw error
    if (!level.modded && !isLevelValid(level.file)) throw new Error("Invalid level");

    const thumbnail = await generateThumbnail(level.file);

    const levelFormData = new FormData();
    if (user) levelFormData.append("creator", user.record.id);
    levelFormData.append("title", level.title);
    levelFormData.append("description", level.description);
    levelFormData.append("data", level.file);
    if (thumbnail && thumbnail.ok) levelFormData.append("thumbnail", await thumbnail.blob());
    levelFormData.append("modded", level.modded);
    if (level.difficulty) {
        levelFormData.append("difficulty", level.difficulty.toString());
    } else {
        levelFormData.append("difficulty", "0");
    }
    levelFormData.append("unlisted", level.unlisted.toString());

    const levelReference = await levels.create<Level>(levelFormData, {
        expand: "creator", // for the webhook
        requestKey: null
    });

    if (!silent) {
        await NewLevelWebhook.send(levelReference);
    }
    return levelReference;
}

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const json = await request.json();
        const payload = PostLevelSchema.parse(json);

        try {
            const level = await _createLevel(payload, locals.user);

            return OK(level);
        } catch (e) {
            console.error(e);

            // TODO: It's not always "My Bad in this instance (see validateLevel)
            return MY_BAD(e instanceof Error ? e.message : "Unknown error");
        }
    } catch (e) {
        console.error(e);

        return BAD();
    }
};
