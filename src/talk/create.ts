import type { CreateLevel, CreateLevelpack, CreateUser, Level, Levelpack } from "$lib/types";
import { levelpacks, levels, users } from "$lib/pocketbase";
import { apiURL, getLevelThumbnailURL, to5bLevelFormat } from "../misc";
import validate from "../client/FileValidator";
import type { User } from "discord-oauth2";

// TODO: Make this function work for levelpacks aswell
export async function validateLevel(level: string) {
    return validate(level).valid
}

export async function validateLevelpack(levels: string[]) {
    return levels.every((level) => validate(level).valid)
}

export async function generateThumbnail(level: string) {
    // TODO: Make sure to change the URL
    return fetch(`${apiURL}/functions/createThumbnail`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: level
    })
}

export async function createUser(cl: CreateUser) {
    return await users.create<User>({
        discordId: cl.discordId,
        username: cl.username,
    })
}

export async function createLevel(cl: CreateLevel) {
    const trimmedLevel = newlineSplitter(cl.level.trim())[0]
    if (!await validateLevel(trimmedLevel)) throw new Error("Invalid level")


    const thumbnail = await generateThumbnail(trimmedLevel)

    const levelFormData = new FormData()
    levelFormData.append("creator", cl.creator.id)
    levelFormData.append("title", cl.title)
    levelFormData.append("description", cl.description)
    levelFormData.append("data", trimmedLevel)
    levelFormData.append("thumbnail", await thumbnail.blob())
    levelFormData.append("modded", cl.modded)

    const levelReference = await levels.create<Level>(levelFormData)

    await fetch(`https://canary.discord.com/api/webhooks/${import.meta.env.VITE_WEBHOOK_ID}/${import.meta.env.VITE_WEBHOOK_SECRET}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "New Level",
            embeds: [
                {
                    title: cl.title,
                    description: cl.description,
                    url: `https://5beam.zelo.dev/level/${levelReference.id}`,
                    color: 5689629,
                    author: {
                        name: cl.creator.global_name,
                        url: `https://5beam.zelo.dev/user/3hfbpvnkpywte1k`,
                        icon_url: `https://cdn.discordapp.com/avatars/${cl.creator.id}/${cl.creator.avatar}.png`
                    },
                    image: {
                        url: getLevelThumbnailURL(levelReference.id, levelReference.thumbnail)
                    }
                }
            ]
        })
    })

    await addToUsersLevels(cl.creator.id, levelReference.id)

    return levelReference;
}

export async function createLevelpack(cl: CreateLevelpack) {
    const trimmedLevels = newlineSplitter(cl.level.trim())
    if (trimmedLevels.length > 53) throw new Error("Too many levels")
    if (!await validateLevelpack(trimmedLevels)) throw new Error("Invalid levelpack")

    const levelsFormData: FormData[] = []
    const levelReferences: Level[] = []

    let i = 0;
    for (const level of trimmedLevels) {
        i++;

        const thumbnail = await generateThumbnail(level)

        const levelFormData = new FormData()
        levelFormData.append("creator", cl.creator.id)
        levelFormData.append("title", `Level ${to5bLevelFormat(i)} of ${cl.title}`)
        levelFormData.append("description", "This level was automatically created for a levelpack.")
        levelFormData.append("data", level)
        levelFormData.append("thumbnail", await thumbnail.blob())
        levelFormData.append("modded", cl.modded)

        levelsFormData.push(levelFormData)

        console.log("Completed level", i, "out of", trimmedLevels.length)
    }

    for (const levelFormData of levelsFormData) {
        levelReferences.push(await levels.create(levelFormData))
    }

    const levelpackReference = await levelpacks.create<Levelpack>({
        // creator: cl.creator.id,
        creator: cl.creator.id,
        title: cl.title,
        description: cl.description,
        levels: levelReferences.map(l => l.id),
        modded: cl.modded
    })

    await fetch(`https://canary.discord.com/api/webhooks/${import.meta.env.VITE_WEBHOOK_ID}/${import.meta.env.VITE_WEBHOOK_SECRET}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "New Levelpack",
            embeds: [
                {
                    title: cl.title,
                    description: cl.description,
                    url: `https://5beam.zelo.dev/levelpack/${levelpackReference.id}`,
                    color: 3461525,
                    author: {
                        name: cl.creator.global_name,
                        url: `https://5beam.zelo.dev/user/3hfbpvnkpywte1k`,
                        icon_url: `https://cdn.discordapp.com/avatars/${cl.creator.id}/${cl.creator.avatar}.png`
                    },
                    image: {
                        url: getLevelThumbnailURL(levelReferences[0].id, levelReferences[0].thumbnail)
                    }
                }
            ]
        })
    })

    await addToUsersLevelpacks(cl.creator.id, levelpackReference.id)

    return levelpackReference;
}

// Normalize newlines to CRLF (level array)
function newlineSplitter(file: string) {
    return file
        .replaceAll(/\\r?\\n/g, "\r\n") // convert to windows linebreaks (HTML5b requires this)
        .split("\r\n\r\n")
}

async function addToUsersLevels(userId: string, levelId: string) {
    let userLevelsArray = (await users.getOne(userId)).levels;
    if (userLevelsArray === undefined) {
        userLevelsArray = [levelId]
    } else {
        userLevelsArray.push(levelId)
    }

    return await users.update<User>(userId, {levels: userLevelsArray})
}

// TODO: Merge with addToUsersLevels?
async function addToUsersLevelpacks(userId: string, levelpackId: string) {
    let userLevelpacksArray = (await users.getOne(userId)).levelpacks;
    if (userLevelpacksArray === undefined) {
        userLevelpacksArray = [levelpackId]
    } else {
        userLevelpacksArray.push(levelpackId)
    }

    return await users.update<User>(userId, {levelpacks: userLevelpacksArray})
}

// TODO: I'll do this via functions
// export async function createUser(obj: Crewa]) {
//     return await prisma.user.create({ data: obj })
// }