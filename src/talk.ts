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

// TODO: Currently this gets every single level.ts
export async function getLevels() {
    return await prisma.level.findMany()
}

export async function getLevel(id: number) {
    return await prisma.level.findUnique({
        where: {
            id: id
        }
    })
}

export async function createUser(request: Request) {
    const form = await request.formData()
    const discordId = Number(form.get("discordId"))
    const name = `${form.get("name")}`

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

export async function getUser(id: number) {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    })
}
