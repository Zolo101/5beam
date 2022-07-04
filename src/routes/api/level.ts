import type { RequestHandler } from "@sveltejs/kit";
import { getLevel } from "../../talk";
import prisma from "../../lib/prisma";

export const get: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = Number(url.searchParams.get("id"))
    const includeData = url.searchParams.get("includeData")

    if (id === null) {
        return {
            status: 404,
        }
    }

    return {
        status: 200,
        body: await getLevel(id)
    }
}


// ugly debug function
async function e() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("")

    for (let i = 0; i < 10; i++) {
        await prisma.level.create({
            data: {
                creatorId: 1,
                title: randomString(10),
                description: randomString(100),
                data: randomString(100),
            }
        })
    }

    function randomString(length: number) {
        let str = ""
        for (let i = 0; i < length; i++) {
            str += alphabet.at(Math.floor(Math.random() * alphabet.length))
        }

        return str
    }
}