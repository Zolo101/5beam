import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export type Level = Prisma.LevelSelect
export type User = Prisma.UserSelect

export default prisma