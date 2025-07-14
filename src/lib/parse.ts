// idk why the zod devs thought /v4 was a good idea now i have to
// remove it when they go back to main
import z, { ZodObject } from "zod/v4";

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
    title: z.string().max(64),
    description: z.string().max(1024),
    data: z.instanceof(File),
    modded: z.stringbool(),

    // auth/refresh
    refresh_token: z.string(),

    // login/redirect
    code: z.string(),
    state: z.string()
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
