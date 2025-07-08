import type { RequestHandler } from "@sveltejs/kit";
import { getLevelById } from "../../../../talk/get";
import { OK, NOT_FOUND } from "../../../../misc";
import { createObjectSchema, parseFromUrlSearchParams } from "$lib/parse";

const schema = createObjectSchema("id");
export const GET: RequestHandler = async ({ url }) => {
    try {
        const { id } = parseFromUrlSearchParams(schema, url);
        return OK(await getLevelById(id));
    } catch {
        return NOT_FOUND();
    }
};

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
