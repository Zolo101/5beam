import prisma from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getLevels(amount: number, offset: number) {
    return await prisma.level.findMany({
        skip: offset,
        take: amount,
        include: {
            creator: true,
        }
    })
}

export async function getLevelByProps(props: Prisma.LevelWhereUniqueInput) {
    return await prisma.level.findUnique({where: props, include: {creator: true}})
}

export async function getLevelpackByProps(props: Prisma.LevelpackWhereUniqueInput) {
    return await prisma.levelpack.findUnique({where: props, include: {creator: true}})
}

export async function getSearch(text: string, amount: number) {
    return await prisma.level.findMany({
        where: {
            title: {contains: text}
        },
        include: {
            creator: true,
        },
        take: amount
    })
}

// TODO: Currently this gets every single user
export async function getUsers() {
    return await prisma.user.findMany()
}

export async function getUserByProps(props: Prisma.UserWhereUniqueInput) {
    return await prisma.user.findUnique({where: props})
}

export async function getUserLevels(props: Prisma.LevelWhereInput, amount: number, offset: number) {
    return await prisma.level.findMany({
        where: props,
        skip: offset,
        take: amount,
        include: {
            creator: true,
        }
    })
}
