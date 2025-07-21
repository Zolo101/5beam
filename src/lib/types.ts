export type Level = {
    id: string;
    creator: PocketbaseUser | null;
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
    creator: PocketbaseUser | null;
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

export type PocketbaseUser = PrivateBaseUserV2["record"];

/** @deprecated we are just gonna use the "private" one now */
export type BaseUserV2 = {
    collectionId: string;
    collectionName: string;
    id: string;
    username: string;
    avatar: string;
    stars: string[]; // soon(tm)
    created: Date;
};

/** Not really private, email is blanked */
export type PrivateBaseUserV2 = {
    record: {
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
