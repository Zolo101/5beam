import type { RequestHandler } from "@sveltejs/kit";
import { MY_BAD, BAD, OK, DENIED } from "$lib/server/misc";
import { type PostLevelType } from "$lib/parse";
import { PostLevelSchema } from "$lib/parse";
import { generateThumbnail, isLevelValid } from "$lib/talk/create";
import { levels } from "$lib/clientPocketbase";
import type { Level, PrivateBaseUserV2 } from "$lib/types";
import { NewLevelWebhook } from "$lib/server/webhook";
import { getLevelDataHash, isLevelUniqueToUser } from "$lib/server/hash";
import { DuplicateError, InvalidError } from "$lib/server/errors";
import validate, { type Sprite } from "$lib/client/FileValidator";

// TODO: Put this somewhere appropiate
function spriteToPocketBaseCharacterId(sprite: Sprite) {
    switch (sprite.entityId) {
        case 0: // Ruby
            return "s4dmiou51ox6tra";
        case 1: // Book
            return "9azb46ypgafu271";
        case 2: // Ice Cube
            return "vllrchrqxdo1o5y";
        case 3: // Match
            return "y8ge9xhroc7w3fj";
        case 4: // Pencil
            return "m5d9bccwongwpfa";
        case 5: // Bubble
            return "ihnvzp3mbty59z3";
        case 6: // Lego Brick
            return "bl212buwh7k37a4";
        case 7: // Waffle
            return "a16m9z4avnsa5s3";
        case 8: // Tune
            return "cne8pxayuxcy02e";
        default: // Don't care
            return undefined;
    }
}

export async function _createLevel(
    level: PostLevelType,
    user: PrivateBaseUserV2,
    silent: boolean = false
) {
    // If the level is a duplicate, throw an error
    const duplicateLevels = await isLevelUniqueToUser(level.file, user.record.id);
    if (duplicateLevels.length > 0) throw new DuplicateError(duplicateLevels![0].id);

    // TODO: Check if redundant?
    const {
        levels: [levelInfo],
        valid
    } = validate(level.file);
    const characters = levelInfo.sprites
        .map(spriteToPocketBaseCharacterId)
        .filter((id) => id !== undefined) as string[];

    // If it's not modded, validate again, and if so throw error
    if (!level.modded && !valid) throw new InvalidError();

    const thumbnail = await generateThumbnail(level.file);

    const levelFormData = new FormData();
    levelFormData.append("creator", user.record.id);
    levelFormData.append("title", level.title);
    levelFormData.append("description", level.description);
    levelFormData.append("data", level.file);
    levelFormData.append("dataHash", await getLevelDataHash(level.file));
    if (thumbnail && thumbnail.ok) levelFormData.append("thumbnail", await thumbnail.blob());
    levelFormData.append("modded", level.modded);
    if (level.difficulty) {
        levelFormData.append("difficulty", level.difficulty.toString());
    } else {
        levelFormData.append("difficulty", "0");
    }
    levelFormData.append("unlisted", level.unlisted.toString());

    // level info columns
    levelFormData.append("area", (levelInfo.width * levelInfo.height).toString());
    levelFormData.append("background", levelInfo.background.toString());
    levelFormData.append("charactersCount", levelInfo.spriteNumber.toString());
    levelFormData.append("characters", JSON.stringify(characters));

    console.log(characters);

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

        if (!locals.user) return DENIED();

        try {
            const level = await _createLevel(payload, locals.user);

            return OK(level);
        } catch (e) {
            console.error(e);

            if (e instanceof DuplicateError) {
                return BAD("You've already uploaded this level!");
            } else if (e instanceof InvalidError) {
                return BAD("The level data is invalid or corrupted.");
            } else {
                return MY_BAD(e instanceof Error ? e.message : "Unknown error");
            }
        }
    } catch (e) {
        console.error(e);

        return BAD();
    }
};
