import type { User } from "$lib/DiscordOauth2";

export type Level = {
    id: string;
    creator: PocketbaseUser;
    created: string;
    updated: string;

    title: string;
    description: string;
    data: string;

    plays: number;
    stars: number;
    difficulty: number;
    featured: boolean;

    thumbnail: string;

    modded: string;
};

export type Levelpack = {
    id: string;
    creator: PocketbaseUser;
    created: string;
    updated: string;

    title: string;
    description: string;
    levels: string[];

    plays: number;
    stars: number;
    featured: boolean;

    modded: string;

    // TODO: thumbnail property?
};

export type Daily = {
    /** level id */
    id: string;

    /** have we already featured this */
    featured: boolean;
};

export type WeeklyChallenge = {
    /** levelpack id */
    id: string;
    attempts: number;
};

export type CreateUser = {
    discordId: string;
    username: string;
};

export type CreateLevel = {
    // discord id (ALWAYS get this server-side)
    creator: User;
    title: string;
    description: string;
    level: string;

    modded: string;
};

export type CreateLevelpack = {
    // discord id (ALWAYS get this server-side)
    creator: User;
    title: string;
    description: string;
    level: string;

    modded: string;
};

export type PocketbaseUser = BaseUserV2;

export type BaseUserV2 = {
    collectionId: string;
    collectionName: string;
    id: string;
    username: string;
    avatar: string;
    stars: string[]; // soon(tm)
    created: Date;
};

export type PrivateBaseUserV2 = {
    collectionId: string;
    collectionName: string;
    id: string;
    email: string;
    emailVisibility: boolean;
    created: Date;
    updated: Date;
    username: string;
    avatar: string;
    roles: string;
    stars: string[]; // soon(tm)
    verified: boolean;
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
