export type Level = {
    id: string
    creator: string
    created: Date

    title: string
    description: string
    data: string

    plays: number
    difficulty: number
    featured: boolean

    // TODO: Make this ALWAYS exist
    expand: {
        creator: User
    }
}

export type Playlist = {
    id: string
    creator: string
    title: string
    description: string // TODO: Maybe?
    created: Date
    updated: Date
    levels: string[]
}

export type CreateLevel = {
    title: string
    description: string
    data: string
}

export type CreatePlaylist = {
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
    playlists: string[]
    stars: string[]
}