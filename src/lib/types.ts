import type { User } from "discord-oauth2";

export type Level = {
    id: string
    creator: PocketbaseUser
    created: string
    updated: string

    title: string
    description: string
    data: string

    plays: number
    stars: number
    difficulty: number
    featured: boolean

    thumbnail: string

    modded: string
}

export type Levelpack = {
    id: string
    creator: PocketbaseUser
    created: string
    updated: string

    title: string
    description: string
    levels: string[]

    plays: number
    stars: number
    featured: boolean

    modded: string

    // TODO: thumbnail property?
}

export type CreateUser = {
    discordId: string
    username: string
}

export type CreateLevel = {
    // discord id (ALWAYS get this server-side)
    creator: User
    title: string
    description: string
    level: string

    modded: string
}

export type CreateLevelpack = {
    // discord id (ALWAYS get this server-side)
    creator: User
    title: string
    description: string
    level: string

    modded: string
}

export type PocketbaseUser = BaseUser & (DiscordUser)
export type DiscordUser = {
    type: "discord"
    discordId: string
}

export type BaseUser = {
    id: string
    type: string
    username: string
    created: Date
    levels: string[]
    levelpacks: string[]
    stars: string[]
}