import type { Level } from "$lib/types";
import { dailyies, levels } from "$lib/pocketbase";
import { functionsApiURL } from "../misc";
import validate from "../client/FileValidator";
import { updateFetch } from "./get";

export async function validateLevel(level: string) {
    return validate(level).valid;
}

export async function validateLevelpack(levels: string[]) {
    return levels.every((level) => validate(level).valid);
}

export function generateThumbnail(level: string) {
    return fetch(`${functionsApiURL}/createThumbnail`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: level
    });
}

export async function featureLevel(levelId: string) {
    return updateFetch<Level>(levels, levelId, { featured: true });
}

export async function addDailyLevel(levelId: string) {
    return dailyies.create({ level: levelId, featured: false });
}

// TODO: I'll do this via functions
// export async function createUser(obj: Crewa]) {
//     return await prisma.user.create({ data: obj })
// }
