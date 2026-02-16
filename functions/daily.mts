import type { Config } from "@netlify/functions";
import type { Daily, Level } from "../src/lib/types";
import Pocketbase from "pocketbase";

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

function clean<T extends Record<string, unknown> | Record<string, unknown>[]>(obj: T): T | null {
    if (obj === undefined || obj === null) return null;
    // console.log(obj);
    if (obj.items) {
        return obj.items.map(cleanObject) as T;
    } else {
        return cleanObject(obj) as T;
    }
}

function getCreatorName(level: Level) {
    return level.expand.creator?.username || "Guest";
}

function makeAuthor(level: Level) {
    return level.expand.creator
        ? {
              name: getCreatorName(level),
              url: `https://5beam.zelo.dev/user/${level.expand.creator.id}`,
              icon_url: `https://cdn.discordapp.com/avatars/${level.expand.creator.id}/${level.expand.creator.avatar}.png`
          }
        : { name: getCreatorName(level) };
}

function getLevelThumbnailURL(id: string, filename: string, mini: boolean = false) {
    return `https://cdn.zelo.dev/api/files/vrxyo8zslj53wuy/${id}/${filename}${mini ? "?thumb=335x184" : ""}`;
}

function sample<T>(array: T[], amount: number) {
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
                    author: makeAuthor(level),
                    image: {
                        url: getLevelThumbnailURL(level.id, level.thumbnail)
                    },
                    footer: {
                        text: `By ${getCreatorName(level)}, ${level.plays} plays`
                    },
                    timestamp: level.created
                }
            ]
        })
    });
};

const attemptToCreateDaily = async (adminPb: Pocketbase) => {
    const dailyies = adminPb.collection("5beam_daily");
    const randomLevels = await adminPb.collection("5beam_levels").getList<Level>(0, 1, {
        expand: "creator",
        filter: "plays > 100 && featured = false && difficulty > 0 && difficulty < 7",
        sort: "@random"
    });

    const randomLevel = randomLevels.items[0];

    return dailyies.create(
        {
            level: randomLevel.id
        },
        {
            expand: "level,level.creator"
        }
    );
};

export default async () => {
    try {
        // Plan A: Get a level thats ready to be a "daily"

        const adminPb = new Pocketbase("https://cdn.zelo.dev");
        await adminPb
            .collection("_superusers")
            .authWithPassword(
                Netlify.env.get("ADMIN_EMAIL_PB")!,
                Netlify.env.get("ADMIN_PASSWORD_PB")!
            );

        const dailyies = adminPb.collection("5beam_daily");

        const dailyiesList = await dailyies.getFullList<Daily>({
            expand: "level,level.creator",
            filter: "featured = false"
        });

        // Warning: Assumes newest daily is "featured = false"
        const nextUp = dailyiesList[0].id;
        await dailyies.update(nextUp, {
            featured: true
        });

        // Plan B: Add a random level (lazy...)
        if (dailyiesList.length <= 1) {
            // console.log(nextUp);

            let randomLevel: Level | null = null;
            for (let i = 0; i < 100; i++) {
                try {
                    if (!randomLevel) {
                        randomLevel = await attemptToCreateDaily(adminPb);
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            if (randomLevel) {
                await sendWebhook(randomLevel.expand.level);
            } else {
                console.log("Failed to create daily");
            }
        } else {
            await sendWebhook(dailyiesList[1].expand.level);
        }
    } catch (e) {
        console.log(e);
    }
};

export const config: Config = {
    schedule: "@daily"
};
