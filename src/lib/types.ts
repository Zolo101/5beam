import type { User } from "discord-oauth2";

export type Level = {
    id: string
    creator: PocketbaseUser
    created: Date
    updated: Date

    title: string
    description: string
    data: string

    views: number
    stars: number
    difficulty: number
    featured: boolean

    thumbnail: string
}

export type Levelpack = {
    id: string
    creator: PocketbaseUser
    created: Date
    updated: Date

    title: string
    description: string
    levels: string[]

    views: number
    stars: number
    featured: boolean

    // TODO: thumbnail property?
}

export type CreateLevel = {
    // discord id (ALWAYS get this server-side)
    creator: User
    title: string
    description: string
    level: string
}

export type CreateLevelpack = {
    // discord id (ALWAYS get this server-side)
    creator: User
    title: string
    description: string
    level: string
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