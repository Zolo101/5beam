export type Level = {
    id: string
    creator: User
    created: Date
    updated: Date

    title: string
    description: string
    data: string

    views: number
    stars: number
    difficulty: number
    featured: boolean
}

export type Levelpack = {
    id: string
    creator: User
    created: Date
    updated: Date

    title: string
    description: string
    levels: string[]

    views: number
    stars: number
    featured: boolean
}

export type CreateLevel = {
    title: string
    description: string
    data: string
}

export type CreateLevelpack = {
    title: string
    description: string
    levels: string[]
}

export type User = BaseUser & (DiscordUser)
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

    // TODO: what about "expand"?
}