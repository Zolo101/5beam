// idk why the zod devs thought /v4 was a good idea now i have to
// remove it when they go back to main
import z, { type ZodObject } from "zod/v4";
import { newlineSplitter } from "$lib/misc";
// import { isLevelValid, isLevelpackValid } from "./talk/create";
// import validate from "./client/FileValidator";

// schema primitives
export const primitives = {
    // level
    id: z.string(),

    // levelpack
    levels: z.coerce.boolean().default(false),

    // user
    discordId: z.string(),

    // page
    page: z.coerce.number().int().min(0).default(0),
    type: z.coerce.number().int().min(0).max(1).default(0),
    sort: z.coerce.number().int().min(0).max(2).default(0),
    featured: z.stringbool().default(false),
    mod: z.string().default(""),

    // random
    amount: z.coerce.number().int().min(1).max(16).default(8),

    // search
    text: z.string().max(64),

    // create/level
    access_token: z.string(),
    title: z.string().min(2).max(64),
    description: z.string().max(1024),
    data: z.instanceof(File),
    modded: z.string().max(64),

    // auth/refresh
    refresh_token: z.string(),

    // login/redirect
    code: z.string(),
    state: z.string(),

    // login/oauth
    redirectURI: z.string().optional(),

    // modify/level
    // TODO: Can I give it a default HERE instead of in createLevel & createLevelpack?
    difficulty: z.number().int().min(0).max(7),
    levelDifficulty: z
        .array(z.number().int().min(0).max(7))
        .length(1)
        .transform((arr) => arr[0])
        .optional(),
    levelpackDifficulty: z.array(z.number().int().min(0).max(7)).min(2).max(200).optional(),
    levelFile: z
        .string()
        .max(1024 * 1024 * 5) // 5 MB Limit
        .trim()
        .transform((file) => newlineSplitter(file)[0]),
    levelpackFile: z
        .string()
        .max(1024 * 1024 * 5) // 5 MB Limit
        .trim()
        .transform((file) => newlineSplitter(file))
        .refine((file) => file.length > 1, { message: "Levelpack must contain at least 2 levels" })
        .refine((file) => file.length <= 200, {
            message: "Levelpack must contain at most 200 levels"
        }),
    // levelFile: z
    //     .string()
    //     .max(1024 * 1024 * 5) // 5 MB Limit
    //     .trim()
    //     .transform((file) => validate(file))
    //     .refine((file) => file.valid || file.modded, { message: "Level is invalid!" }),
    // levelpackFile: z
    //     .string()
    //     .max(1024 * 1024 * 5) // 5 MB Limit
    //     .trim()
    //     .transform((file) => validate(file))
    //     .refine((file) => file.valid || file.modded, { message: "Levelpack is invalid!" })
    //     .refine((file) => file.levels.length > 1, {
    //         message: "Levelpack must contain at least 2 levels"
    //     })
    //     .refine((file) => file.levels.length <= 200, {
    //         message: "Levelpack must contain at most 200 levels"
    //     })

    // modify/level V2 (not on API, 5beam only for now)
    order: z.array(z.string()),

    // report
    reportKind: z.enum(["level", "levelpack", "user"]),
    reportReason: z.enum(["inappropriate", "spam", "other"]),
    reportDesc: z.string().max(1024).optional()
};

export function createObjectSchema<T extends keyof typeof primitives>(...keys: T[]) {
    const obj = keys.reduce(
        (acc, key) => {
            acc[key] = primitives[key];
            return acc;
        },
        {} as { [K in T]: (typeof primitives)[K] }
    );
    return z.object(obj);
}

export function parseFromUrlSearchParams<T extends keyof typeof primitives>(
    schema: ZodObject<{ [K in T]: (typeof primitives)[K] }>,
    data: URL
) {
    return schema.parse(Object.fromEntries(data.searchParams));
}

// Level (singular)
export const PostLevelSchema = z.object({
    title: primitives.title,
    description: primitives.description,
    difficulty: primitives.levelDifficulty,
    modded: primitives.modded,
    file: primitives.levelFile,
    unlisted: z.boolean().default(false)
});
export type PostLevelType = z.infer<typeof PostLevelSchema>;

// Levelpack (multiple)
export const PostLevelpackSchema = z.object({
    title: primitives.title,
    description: primitives.description,
    difficulty: primitives.levelpackDifficulty,
    modded: primitives.modded,
    file: primitives.levelpackFile
});
export type PostLevelpackType = z.infer<typeof PostLevelpackSchema>;

export const ModifyLevelSchema = PostLevelSchema.partial();
export type ModifyLevelType = z.infer<typeof ModifyLevelSchema>;

/** @todo `difficulty` is actually required! */
export const ModifyLevelpackSchema = PostLevelpackSchema.partial();
export type ModifyLevelpackType = z.infer<typeof ModifyLevelpackSchema>;
