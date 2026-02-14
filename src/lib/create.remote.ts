import { form, getRequestEvent } from "$app/server";
import z, { ZodType } from "zod";
import { createObjectSchema, primitives } from "./parse";
import { DENIED } from "./server/misc";
import { _createLevel } from "../routes/(api)/api/create/level/+server";
import { redirect } from "@sveltejs/kit";
import { ReportWebhook } from "./server/webhook";
import type { Report } from "./types";

/** Svelte forms dont allow objects or arrays */
function formParse<O, I>(type: ZodType<O, I>) {
    return z
        .string()
        .transform((val) => {
            try {
                return JSON.parse(val);
            } catch {
                return {};
            }
        })
        .pipe(type);
}

const ModifyLevelpackSchemaV2 = z.object({
    id: primitives.id,
    title: primitives.title,
    description: primitives.description,
    levels: formParse(
        z.array(
            z.object({
                title: primitives.title,
                difficulty: primitives.difficulty,
                modded: primitives.modded,
                raw: z.string()
            })
        )
    ),
    order: formParse(primitives.order),
    unlisted: z.boolean().default(false)
});

const reportSchema = createObjectSchema("reportKind", "reportReason", "reportDesc");

// This is NOT /api/modify/*
export const updateLevelpackV2 = form(ModifyLevelpackSchemaV2, async (data) => {
    const {
        locals: { user, pb }
    } = getRequestEvent();
    if (!user) return DENIED();

    // How order works is this
    // order = [levelId1, levelId2, "@0", levelId3]
    // This means that levelId1 is first, levelId2 is second, a newLevels[0] is third, levelId3 is fourth
    const newLevels = await Promise.all(
        data.levels.map((level) =>
            _createLevel(
                {
                    title: level.title,
                    description: `This level is a part of levelpack "${data.title}"`,
                    difficulty: level.difficulty,
                    modded: level.modded,
                    file: level.raw,
                    unlisted: true
                },
                user,
                true
            )
        )
    );

    const newOrder = data.order.map((idOrPointer) => {
        if (idOrPointer.startsWith("@")) {
            const index = parseInt(idOrPointer.slice(1), 10);
            return newLevels[index].id;
        }
        return idOrPointer;
    });

    await pb.collection("5beam_levelpacks").update(data.id, {
        title: data.title,
        description: data.description,
        levels: newOrder
    });

    redirect(303, `/levelpack/${data.id}`);
});

export const reportKindById = form(reportSchema, async (data) => {
    const {
        locals: { user, pb },
        params: { id }
    } = getRequestEvent();
    if (!user) return DENIED();

    const report = await pb.collection<Report>("5beam_reports").create({
        reportedId: id,
        kind: data.reportKind,
        reason: data.reportReason,
        description: data.reportDesc
    });

    await ReportWebhook.send(report);
    return { report, success: true };
});
