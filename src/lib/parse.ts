// idk why the zod devs thought /v4 was a good idea now i have to
// remove it when they go back to main
import z, { type ZodObject } from "zod/v4";
import { newlineSplitter } from "$lib/misc";

// schema primitives
export const primitives = {
    // level
    id: z.string(),

    // levelpack
    levels: z.coerce.boolean().default(false),

    // user
    discordId: z.string(),

    // page
    page: z.coerce.number().int().min(1).default(1),
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
        })
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
    file: primitives.levelFile
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

export const ModifyLevelpackSchema = z
    .object({
        title: primitives.title,
        description: primitives.description,
        modded: primitives.modded,
        levels: z.array(ModifyLevelSchema)
    })
    .partial();
export type ModifyLevelpackType = z.infer<typeof ModifyLevelpackSchema>;
