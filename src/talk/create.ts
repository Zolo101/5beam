import type { CreateLevel, CreateLevelpack, CreateUser, Level, Levelpack } from "$lib/types";
import { levelpacks, levels, users } from "$lib/pocketbase";
import { functionsApiURL } from "../misc";
import validate from "../client/FileValidator";
import { getUserByDiscordId, updateFetch } from "./get";
import type { User } from "$lib/DiscordOauth2";
import { NewLevelpackWebhook, NewLevelWebhook } from "$lib/webhook";

// TODO: Make this function work for levelpacks aswell
export async function validateLevel(level: string) {
    return validate(level).valid
}

export async function validateLevelpack(levels: string[]) {
    return levels.every((level) => validate(level).valid)
}

export function generateThumbnail(level: string) {
    return fetch(`${functionsApiURL}/createThumbnail`, {
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

    // if not valid and not modded, throw error
    if (!await validateLevel(trimmedLevel) && !cl.modded) throw new Error("Invalid level")

    const thumbnail = await generateThumbnail(trimmedLevel)
    const successful = thumbnail?.headers.get("Content-Type") === "image/png";
    const dbUser = await getUserByDiscordId(cl.creator.id)

    const levelFormData = new FormData()
    levelFormData.append("creator", dbUser.id)
    levelFormData.append("title", cl.title)
    levelFormData.append("description", cl.description)
    levelFormData.append("data", trimmedLevel)
    if (thumbnail && successful) levelFormData.append("thumbnail", await thumbnail.blob())
    levelFormData.append("modded", cl.modded)

    const levelReference = await levels.create<Level>(levelFormData)

    // TODO: This wont send if you are in local and the thumbnail fails to generate!


    await NewLevelWebhook.send(levelReference)
    await addToUsersLevels(dbUser.id, levelReference.id)

    return levelReference;
}

export async function createLevelpack(cl: CreateLevelpack) {
    const trimmedLevels = newlineSplitter(cl.level.trim())
    if (trimmedLevels.length > 200) throw new Error("Too many levels")

    // if not valid and not modded, throw error
    if (!await validateLevelpack(trimmedLevels) && !cl.modded) throw new Error("Invalid levelpack")

    const dbUser = await getUserByDiscordId(cl.creator.id)

    const levelsFormData: FormData[] = []
    const levelReferences: Level[] = []

    // spam amazon servers with thumbnail generation requests 😭
    const thumbnailPromises = trimmedLevels.map(l => generateThumbnail(l))
    const thumbnails = await Promise.allSettled(thumbnailPromises);

    for (let i = 0; i < trimmedLevels.length; i++) {
        const level = trimmedLevels[i]
        const thumbnail = thumbnails[i]

        // On very rare occasions, the thumbnail generator can fail but not return 500.
        // Instead, giving a 200 response with a text/plain content type, saying "RangeError: Invalid array length".
        const successful = thumbnail.status === "fulfilled" && thumbnail.value.headers.get("Content-Type") === "image/png";

        const split = level.split("\r\n")
        const title = split[0] === "loadedLevels=" ? split[1] : split[0]

        const levelFormData = new FormData()
        levelFormData.append("creator", dbUser.id)
        levelFormData.append("title", title)
        levelFormData.append("description", `This level is a part of levelpack "${cl.title}".`)
        levelFormData.append("data", level)
        if (successful) levelFormData.append("thumbnail", await thumbnail.value.blob())
        levelFormData.append("modded", cl.modded)

        levelsFormData.push(levelFormData)

        console.log("Completed level", i + 1, "out of", trimmedLevels.length)
    }

    for (const levelFormData of levelsFormData) {
        levelReferences.push(await levels.create(levelFormData))
    }

    const levelpackReference = await levelpacks.create<Levelpack>({
        creator: dbUser.id,
        title: cl.title,
        description: cl.description,
        levels: levelReferences.map(l => l.id),
        modded: cl.modded
    })

    await NewLevelpackWebhook.send(levelpackReference, levelReferences[0])
    await addToUsersLevelpacks(dbUser.id, levelpackReference.id)

    return levelpackReference;
}

// Normalize newlines to CRLF (level array)
export function newlineSplitter(file: string) {
    return file
        .replaceAll(/\r\n|\r|\n/g, "\r\n") // convert to windows linebreaks (HTML5b requires this)
        .split("\r\n\r\n")
}

async function addToUsersLevels(userId: string, levelId: string) {
    return updateFetch<User>(users, userId, {"levels+": levelId})
}

async function addToUsersLevelpacks(userId: string, levelpackId: string) {
    return updateFetch<User>(users, userId, {"levelpacks+": levelpackId})
}

// TODO: I'll do this via functions
// export async function createUser(obj: Crewa]) {
//     return await prisma.user.create({ data: obj })
// }