import z from "zod";
import { primitives } from "./parse";

export const UserSchema = z.object({
    // collectionId: z.string(),
    // collectionName: z.string(),
    id: primitives.id,
    username: z.string(),
    avatar: z.string(),
    stars: z.string().array(), // soon(tm)
    created: z.string() // Date
});

export const LevelSchema = z.object({
    id: primitives.id,
    creator: z.union([UserSchema, z.null()]), // TODO
    // FOR SOME REASON POCKETBASE REMVOES THE T IN THE ISO STRING??
    // created: z.iso.datetime(), // TODO make this a primitive
    // updated: z.iso.datetime(),
    created: z.string(), // TODO make this a primitive
    updated: z.string(),

    title: primitives.title,
    description: primitives.description,
    data: z.string().max(1000000), // 1MB // TODO: is this true?

    plays: z.number().int().min(0),
    stars: z.number().int().min(0),
    difficulty: primitives.difficulty,
    featured: z.boolean(),

    // File name, not URL
    thumbnail: z.string().max(1000), // 1KB

    unlisted: z.boolean(),
    modded: z.string().max(1000), // 1KB

    area: z.number().int().min(0),
    background: z.number().int().min(0),
    characters: z.array(z.string())
});

export const LevelpackSchema = z.object({
    id: primitives.id,
    creator: z.union([UserSchema, z.null()]), // TODO
    created: z.string(), // TODO make this a primitive
    updated: z.string(),
    title: primitives.title,
    description: primitives.description,
    levels: z.string().array(),

    plays: z.number().int().min(0),
    stars: z.number().int().min(0),
    featured: z.boolean(),

    modded: z.string().max(1000) // 1KB;

    // unlisted: z.boolean() // TODO: Add this. levelpack doesnt have unlisted functionality

    // TODO: thumbnail property?
});

export type Level = z.infer<typeof LevelSchema>;
export type Levelpack = z.infer<typeof LevelpackSchema>;
export type User = z.infer<typeof UserSchema>;

export type Daily = {
    /** level id */
    id: string;

    /** have we already featured this */
    featured: boolean;
};

export type Report = {
    id: string;
    created: string;
    updated: string;

    reportedId: string;
    kind: "level" | "levelpack" | "user";
    reason: string;
    description: string;
    resolved: boolean;
};

export type WeeklyChallenge = {
    /** levelpack id */
    id: string;
    attempts: number;
};

export type LevelStarred = {
    user: string;
    /** level id */
    item: string;
};

export type LevelpackStarred = {
    user: string;
    /** levelpack id */
    item: string;
};

export type CreateUser = {
    discordId: string;
    username: string;
};

export type CreateLevel = {
    creator: PrivateBaseUserV2;
    title: string;
    description: string;
    level: string;

    modded: string;
};

export type CreateLevelpack = {
    creator: PrivateBaseUserV2;
    title: string;
    description: string;
    level: string;

    modded: string;
};

export type PocketbaseUser = PrivateBaseUserV2; //["record"];

/** @deprecated we are just gonna use the "private" one now */
export type BaseUserV2 = {
    collectionId: string;
    collectionName: string;
    id: string;
    username: string;
    avatar: string;
    stars: string[]; // soon(tm)
    created: string; // Date
};

/** Not really private, email is blanked */
export type PrivateBaseUserV2 = {
    record: {
        collectionId: string;
        collectionName: string;
        id: string;
        email: string;
        emailVisibility: boolean;
        created: string; // Date
        updated: string; // Date
        username: string;
        avatar: string;
        roles: string;
        stars: string[]; // TODO: Does this exist?
        verified: boolean;
    };
    token: string;
};

export type DiscordMeta = {
    accessToken: string;
    refreshToken: string;
    avatarURL: string;
    email: string;
    expiry: string; // Date
    id: string;
    isNew: boolean;
    name: string;
    username: string;
};

/** @deprecated Use `BaseUserV2` */
export type BaseUser = {
    id: string;
    type: string;
    username: string;
    created: Date;
    levels: string[];
    levelpacks: string[];
    stars: string[];
};

export type LevelChange = {
    title: string;
    action: "create" | "update" | "delete";
};

export type LevelpackDifficultyChange = {
    title: string;
    oldD: number;
    newD: number;
};

export type Character = {
    id: string;
    name: string;
    image: string;
    created: string;
    updated: string;
};
