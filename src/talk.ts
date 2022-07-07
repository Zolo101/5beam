import prisma from "./lib/prisma";

export async function createLevel(request: Request) {
    const form = await request.formData()
    const creatorId = Number(form.get("creatorId"))
    const title = `${form.get("title")}`
    const description = `${form.get("description")}`
    const data = `${form.get("data")}`

    await prisma.level.create({
        data: {
            creatorId: creatorId,
            title: title,
            description: description,
            data: data,
        }
    })
}

export async function getLevels(amount: number, offset: number) {
    return await prisma.level.findMany({
        skip: offset,
        take: amount,
    })
}

export async function getLevel(id: number) {
    return await prisma.level.findUnique({
        where: {
            id: id
        }
    })
}

export async function createUser(discordId: number, name: string) {
    await prisma.user.create({
        data: {
            discordId: discordId,
            name: name,
        }
    })
}

// TODO: Currently this gets every single user
export async function getUsers() {
    return await prisma.user.findMany()
}

export async function getUserById(id: number) {
    return await prisma.user.findUnique({
        where: {
            id: id,
        }
    })
}

export async function getUserByDiscordId(discordId: number) {
    return await prisma.user.findUnique({
        where: {
            discordId: discordId,
        }
    })
}

export async function getUserLevels(creatorId: number, amount: number, offset: number) {
    return await prisma.level.findMany({
        where: {
            creatorId: creatorId
        },
        skip: offset,
        take: amount,
    })
}

