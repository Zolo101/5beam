import type { RequestHandler } from "@sveltejs/kit";
import { BAD, MY_BAD, OK } from "../../../../../misc";
import { type PostLevelpackType } from "$lib/parse";
import { PostLevelpackSchema } from "$lib/parse";
import { generateThumbnail, validateLevelpack } from "../../../../../talk/create";
import type { Levelpack, PrivateBaseUserV2 } from "$lib/types";
import { levelpacks } from "$lib/pocketbase";
import { NewLevelpackWebhook } from "$lib/webhook";
import type PocketBase from "pocketbase";

async function createLevelpack(
    levelpack: PostLevelpackType,
    user: PrivateBaseUserV2 | null,
    pb: PocketBase
) {
    // if not valid and not modded, throw error
    if (!(await validateLevelpack(levelpack.file)) && !levelpack.modded)
        throw new Error("Invalid levelpack");

    const levelsFormData: FormData[] = [];
    const levelsBatch = pb.createBatch();

    // spam amazon servers with thumbnail generation requests 😭
    const thumbnailPromises = levelpack.file.map((l) => generateThumbnail(l));
    const thumbnails = await Promise.allSettled(thumbnailPromises);

    for (let i = 0; i < levelpack.file.length; i++) {
        const level = levelpack.file[i];
        const thumbnail = thumbnails[i];

        // On very rare occasions, the thumbnail generator can fail but not return 500.
        // Instead, giving a 200 response with a text/plain content type, saying "RangeError: Invalid array length".
        const successful =
            thumbnail.status === "fulfilled" &&
            thumbnail.value.headers.get("Content-Type") === "image/png";

        const split = level.split("\r\n");
        const title = split[0] === "loadedLevels=" ? split[1] : split[0];

        const levelFormData = new FormData();
        if (user) levelFormData.append("creator", user.id);
        levelFormData.append("title", title);
        levelFormData.append(
            "description",
            `This level is a part of levelpack "${levelpack.title}".`
        );
        levelFormData.append("data", level);
        if (successful) levelFormData.append("thumbnail", await thumbnail.value.blob());
        levelFormData.append("modded", levelpack.modded);
        if (levelpack.difficulty) {
            levelFormData.append("difficulty", levelpack.difficulty[i].toString());
        } else {
            levelFormData.append("difficulty", "0");
        }
        levelFormData.append("unlisted", "true");

        levelsFormData.push(levelFormData);

        console.log("Completed level", i + 1, "out of", levelpack.file.length);
    }

    // TODO: for modify/levelpack, upsert looks good, its apparently a combo of update + insert

    for (const levelFormData of levelsFormData) {
        levelsBatch.collection("5beam_levels").create(levelFormData);
    }

    const result = await levelsBatch.send();

    const levelpackReference = await levelpacks.create<Levelpack>({
        creator: user?.id,
        title: levelpack.title,
        description: levelpack.description,
        levels: result.map((l) => l.body.id),
        modded: levelpack.modded
    });

    await NewLevelpackWebhook.send(levelpackReference, result[0].body);

    return levelpackReference;
}

// TODO: Have a look at the TODO's in the singular level +server.ts. They apply to here aswell
export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const json = await request.json();
        const payload = PostLevelpackSchema.parse(json);

        try {
            const levelpack = await createLevelpack(payload, locals.user, locals.pb);

            return OK(levelpack);
        } catch (e) {
            console.error(e);

            return MY_BAD(e instanceof Error ? e.message : "Unknown error");
        }
    } catch (e) {
        console.error(e);

        return BAD();
    }
};
