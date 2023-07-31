// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getLevelById } from "../../../talk/get";
import { return404 } from "../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")
    const includeData = url.searchParams.get("includeData")

    if (id === null) return return404() // Not Found

    // e()

    return new Response(await getLevelById(id), {status: 200})
}


// ugly debug function
/*
let why = false
async function e() {
    if (why) return
    why = true
    // console.log(levels)
    const parsedLevels = levels.split("\n\n").map(lvl => "loadedLevels=\n" + lvl)
    console.log(parsedLevels)
    let i = 1;

    for (const parsedLevel of parsedLevels) {
        await prisma.level.create({
            data: {
                creatorId: 1,
                title: `Level ${`${i}`.padStart(3, "0")}`,
                description: "Created by carykh, uploaded by me (zelo)",
                data: parsedLevel,
            }
        })
        i += 1;
    }
    why = false
}*/