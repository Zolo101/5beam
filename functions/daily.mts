import type { Config } from "@netlify/functions";
import type { Daily, Level } from "../src/lib/types";
import { adminPb } from "../src/lib/server/adminPocketbase";

// netlify does not like $app/environment in misc.ts
// import { getLevelThumbnailURL, sample } from "../src/misc";

// get.ts imports misc.ts so it also has to go...
// import { getLevelById } from "../src/talk/get";

export async function getLevelById(id: string) {
    return await adminPb.collection("5beam_levels").getOne<Level>(id, { expand: "creator" });
}

function cleanObject(obj: Record<string, any>) {
    // TODO: Figure out why getUserLevelpacks & getUserByDiscordId gives undefined objects
    if (obj === undefined) {
        console.trace("WARNING: undefined in cleanObject()");
        return {};
    }

    delete obj.collectionId;
    delete obj.collectionName;

    const expand = obj.expand;
    if (expand) {
        if (Object.keys(expand).length === 0) delete obj.expand;

        for (const key in expand) {
            const prop = expand[key];

            if (Array.isArray(prop)) {
                if (prop.length > 0) expand[key] = prop.map(cleanObject);
            }

            obj[key] = cleanObject(prop);
            delete obj.expand;
        }
    }

    return obj;
}

export function clean<T extends Record<string, unknown> | Record<string, unknown>[]>(
    obj: T
): T | null {
    if (obj === undefined || obj === null) return null;
    // console.log(obj);
    if (obj.items) {
        return obj.items.map(cleanObject) as T;
    } else {
        return cleanObject(obj) as T;
    }
}

export function getLevelThumbnailURL(id: string, filename: string, mini: boolean = false) {
    return filename
        ? `https://cdn.zelo.dev/api/files/vrxyo8zslj53wuy/${id}/${filename}${mini ? "?thumb=335x184" : ""}`
        : `https://5beam.zelo.dev/placeholder.png`;
}

export function sample<T>(array: T[], amount: number) {
    if (amount > array.length) throw new Error("Amount is greater than array length.");

    const result: T[] = [];
    for (let i = 0; i < amount; i++) {
        const index = ~~(Math.random() * array.length);
        result.push(array[index]);
        array.splice(index, 1);
    }
    return result;
}

const sendWebhook = async (level: Level) => {
    await fetch(Netlify.env.get("VITE_WEBHOOK_DAILYIES")!, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: "New Daily",
            embeds: [
                {
                    title: level.title,
                    description: level.description,
                    url: `https://5beam.zelo.dev/level/${level.id}`,
                    color: 16761344,
                    author: {
                        name: level.creator.global_name,
                        url: `https://5beam.zelo.dev/user/${level.creator.id}`,
                        icon_url: `https://cdn.discordapp.com/avatars/${level.creator.id}/${level.creator.avatar}.png`
                    },
                    image: {
                        url: getLevelThumbnailURL(level.id, level.thumbnail)
                    },
                    footer: {
                        text: `By ${level.expand.creator.username}, ${level.plays} plays`
                    },
                    timestamp: level.created
                }
            ]
        })
    });
};

export default async () => {
    // Plan A: Get a level thats ready to be a "daily"

    const dailyies = adminPb.collection("5beam_daily");

    const dailyiesList = await dailyies.getFullList<Daily>({
        expand: "level,level.creator",
        filter: "featured = false"
    });

    const nextUp = dailyiesList[0].id;
    await dailyies.update(nextUp, {
        featured: true
    });

    // Plan B: Add a random level (lazy...)
    if (dailyiesList.length <= 1) {
        const randomLevels = await adminPb.collection("5beam_levels").getList<Level>(0, 1, {
            expand: "creator",
            filter: "plays > 100 && featured = false && difficulty > 0 && difficulty < 7",
            sort: "@random"
        });

        const randomLevel = randomLevels.items[0];

        await dailyies.create({
            level: randomLevel.id
        });

        // console.log(nextUp);

        await sendWebhook(randomLevel);
    } else {
        await sendWebhook(dailyiesList[1].expand.level);
    }
};

export const config: Config = {
    schedule: "@daily"
};
