import type { RequestHandler } from "@sveltejs/kit";
import { isAdmin } from "$lib/misc";
import { DENIED, MY_BAD, BAD, OK, NOT_FOUND } from "$lib/server/misc";
import { ModifyLevelpackSchema } from "$lib/parse";
import { getLevelpackByIdWithLevels } from "$lib/server/get";
import {
    ChangeDescriptionWebhook,
    ChangeLevelpackDifficultyWebhook,
    ChangeLevelpackWebhook,
    ChangeTitleWebhook
} from "$lib/server/webhook";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";
import { _createLevel } from "../../create/level/+server";
import type { LevelChange, LevelpackDifficultyChange } from "$lib/types";
import validate from "$lib/client/FileValidator";
import { _modifyLevel } from "../level/+server";
import pLimit from "p-limit";

const urlSchema = createObjectSchema("id");
export const POST: RequestHandler = async ({ url, request, locals }) => {
    try {
        const json = await request.json();
        const payload = ModifyLevelpackSchema.parse(json);

        const { id } = parseFromUrlSearchParams(urlSchema, url);

        // Reminder, this is obtained using pb_auth cookie
        const { user } = locals;
        if (!user) return DENIED();

        // pocketbase is a big BABY
        const limit = pLimit(10);

        try {
            const levelpack = await getLevelpackByIdWithLevels(id);
            if (!levelpack) return NOT_FOUND();
            if (!levelpack.creator) return DENIED(); // A Guest made this

            // Another check is also done database-side
            const allowed = user.record.id === levelpack.creator.id || isAdmin(user);
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

                if (payload.file !== undefined) {
                    const { levels: payloadJSON, valid } = validate(
                        payload.file?.join("\n\n") ?? ""
                    );
                    const levelChanges: LevelChange[] = [];
                    // const updateBatch = locals.pb.createBatch();
                    const newLevelLength = payload.file.length;
                    const oldLevelLength = levelpack.levels.length;
                    const lengthDifference = newLevelLength - oldLevelLength;

                    // Update in place
                    await Promise.allSettled(
                        // We only want to update the levels that are already in the levelpack
                        payload.file.slice(0, oldLevelLength).map((_, i) => {
                            if (!valid) {
                                return MY_BAD("Invalid level"); // HOW??
                            }

                            // for changelog
                            levelChanges.push({
                                title: payloadJSON[i].name,
                                action: "update"
                            });

                            return limit(() =>
                                _modifyLevel(
                                    levelpack.levels[i].id,
                                    {
                                        title: payloadJSON[i].name,
                                        file: payload.file![i],
                                        difficulty: payload.difficulty?.[i],
                                        modded: levelpack.modded
                                    },
                                    user,
                                    locals.pb,
                                    true
                                )
                            );
                        })
                    );

                    if (lengthDifference === 0) {
                        // Same length, we dont have to do (n == o)
                    } else if (lengthDifference > 0) {
                        // New levels (n > o)
                        const newLevels = await Promise.allSettled(
                            payload.file
                                .slice(oldLevelLength, newLevelLength)
                                .map(async (level, i) => {
                                    // for changelog... not gaurenteed sort (because async)
                                    const index = i + oldLevelLength;
                                    const title = payloadJSON[index].name;

                                    levelChanges.push({
                                        title,
                                        action: "create"
                                    });

                                    return limit(() =>
                                        _createLevel(
                                            {
                                                title,
                                                description: `This level is a part of levelpack "${payload.title}"`,
                                                modded: levelpack.modded,
                                                file: level,
                                                difficulty: payload.difficulty?.[index],
                                                unlisted: true
                                            },
                                            user,
                                            true
                                        )
                                    );
                                })
                        );
                        await locals.pb.collection("5beam_levelpacks").update(id, {
                            "levels+": newLevels
                                .map((l) => (l.status === "fulfilled" ? l.value.id : null))
                                .filter((l) => l !== null)
                        });
                    } else {
                        // Removed levels (n < o)
                        for (let i = newLevelLength; i < oldLevelLength; i++) {
                            const level = levelpack.levels[i];
                            await locals.pb.collection("5beam_levels").delete(level.id);
                            await locals.pb.collection("5beam_levelpacks").update(id, {
                                "levels-": level.id
                            });

                            // for changelog
                            levelChanges.push({
                                title: level.title,
                                action: "delete"
                            });
                        }
                    }

                    // await updateBatch.send();
                    await ChangeLevelpackWebhook.send(levelChanges, levelpack);
                }

                // TODO: Make it so that difficulty change webhooks also happen when changing the levelpack itself
                // Special case: Difficulty change but no new file
                if (payload.difficulty !== undefined && payload.file === undefined) {
                    const levelChanges: LevelpackDifficultyChange[] = [];

                    await Promise.allSettled(
                        levelpack.levels.map((level, i) => {
                            if (
                                payload.difficulty?.[i] !== undefined &&
                                level.difficulty !== payload.difficulty?.[i]
                            ) {
                                levelChanges.push({
                                    title: level.title,
                                    oldD: level.difficulty,
                                    newD: payload.difficulty?.[i]
                                });
                            }

                            return limit(() =>
                                _modifyLevel(
                                    level.id,
                                    {
                                        difficulty: payload.difficulty?.[i]
                                    },
                                    user,
                                    locals.pb,
                                    true
                                )
                            );
                        })
                    );

                    await ChangeLevelpackDifficultyWebhook.send(levelChanges, levelpack);
                }

                return OK(
                    await locals.pb.collection("5beam_levelpacks").update(id, payloadFormData)
                );
            } else {
                return DENIED();
            }
        } catch (e) {
            console.error(e);
            return MY_BAD();
        }
    } catch (e) {
        console.error(e);
        return BAD();
    }
};
