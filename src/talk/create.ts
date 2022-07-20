import prisma from "../lib/prisma";
import type { Prisma } from "@prisma/client";

export async function createLevel(obj: Prisma.LevelCreateArgs["data"]) {
    return await prisma.level.create({ data: obj })
}

export async function createLevelpack(obj: Prisma.LevelpackCreateArgs["data"]) {
    return await prisma.levelpack.create({ data: obj })
}

export async function createUser(obj: Prisma.UserCreateArgs["data"]) {
    return await prisma.user.create({ data: obj })
}