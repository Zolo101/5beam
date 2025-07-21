// TODO: Remove client pocketbase imports -- Secure but we dont wanna use them
import { dailyies, levelpacks, levels, clientPb, usersV2, weeklies } from "$lib/clientPocketbase";
import type { Daily, Level, Levelpack, PrivateBaseUserV2, WeeklyChallenge } from "$lib/types";
import { ClientResponseError, type RecordListOptions } from "pocketbase";

export async function getDaily() {
    const daily = await dailyies.getList<Daily>(1, 1, {
        filter: "featured = false",
        expand: "level,level.creator"
    });

    return daily;
}

export async function getWeeklyChallenge() {
    return await weeklies.getList<WeeklyChallenge>(1, 1, {
        expand: "creator",
        sort: "-created"
    });
}

export async function getLevels(
    page: number,
    sortCode: number,
    featured: boolean,
    mod: string,
    amount: number,
    options?: RecordListOptions
) {
    const sort = getSort(sortCode);
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

    return await levels.getList<Level>(page, amount, {
        expand: "creator",
        sort,
        filter: featuredFilter + modFilter,
        ...options
    });
}

export async function getRandomLevels(
    amount: number,
    type: number,
    featured: boolean,
    mod: string
) {
    const db = type ? levelpacks : levels;
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = `modded = "${mod}"`;

    // TODO: Do this function without getting every level in the database.
    return await db.getList<Level | Levelpack>(0, amount, {
        expand: "creator",
        filter: clientPb.filter(`unlisted = false && {:featured} {:mod}`, {
            featured: featuredFilter,
            mod: modFilter
        }),
        sort: "@random"
    });
}

export async function getLevelpacks(
    page: number,
    sortCode: number,
    featured: boolean,
    mod: string,
    amount: number,
    options?: RecordListOptions
) {
    const sort = getSort(sortCode);
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

    return await levelpacks.getList<Levelpack>(page, amount, {
        expand: "creator",
        sort,
        filter: featuredFilter + modFilter,
        ...options
    });
}

// TODO: Merge with getLevelpackById
export async function getLevelpackByIdWithLevels(id: string) {
    return await levelpacks.getOne<
        Omit<Levelpack, "levels"> & {
            levels: Level[];
        }
    >(id, { expand: "creator, levels.creator" });
}

export async function getLevelById(id: string) {
    return await levels.getOne<Level>(id, { expand: "creator" });
}

export async function getLevelpackById(id: string) {
    return await levelpacks.getOne<Levelpack>(id, { expand: "creator" });
}

export async function getRelatedLevels(level: Level) {
    return await levels.getList<Level>(1, 4, {
        filter: clientPb.filter(`id != {:id} && modded = {:modded} && difficulty = {:difficulty}`, {
            id: level.id,
            modded: level.modded,
            difficulty: level.difficulty
        }),
        expand: "creator",
        sort: "@random"
    });
}

export async function getTrendingLevels(
    page: number,
    amount: number,
    mod: string,
    options?: RecordListOptions
) {
    const modFilter = clientPb.filter(`modded = {:mod}`, { mod });
    const range = 1000 * 60 * 60 * 24 * 14; // 2 weeks
    const date = new Date(Date.now() - range).toISOString().replace("T", " ").substring(0, 19);
    const filter = clientPb.filter(modFilter + " && created >= {:date}", { date });

    return await levels.getList<Level>(page, amount, {
        expand: "creator",
        sort: "-plays",
        filter,
        ...options
    });
}

export async function getSearch(
    text: string,
    page: number,
    amount: number,
    mod: string | undefined
) {
    return await levels.getList<Level>(page, amount, {
        expand: "creator",
        filter: clientPb.filter(`title ~ {:text} && modded = {:mod}`, { text, mod })
    });
}

export async function getUserById(id: string) {
    try {
        return await usersV2.getOne<PrivateBaseUserV2["record"]>(id);
    } catch (e) {
        // 404 -- Not found
        if (e instanceof ClientResponseError && e.status === 404) {
            return null;
        }
        throw e;
    }
}

// TODO: Why do we need requestKey: null when requesting both getUserLevels and getUserLevelpacks?
export async function getUserLevels(
    id: string,
    page: number,
    sortCode: number,
    featured: boolean,
    amount: number,
    mod: string | undefined,
    options?: RecordListOptions
) {
    const sort = getSort(sortCode);
    const creatorFilter = clientPb.filter(`creator = {:id} && `, { id });
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

    return await levels.getList<Level>(page, amount, {
        expand: "creator",
        sort,
        filter: creatorFilter + featuredFilter + modFilter,
        ...options
    });
}

export async function getUserLevelpacks(
    id: string,
    page: number,
    sortCode: number,
    featured: boolean,
    amount: number,
    mod: string | undefined,
    options?: RecordListOptions
) {
    const sort = getSort(sortCode);
    const creatorFilter = clientPb.filter(`creator = {:id} && `, { id });
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

    return await levelpacks.getList<Levelpack>(page, amount, {
        expand: "creator",
        sort,
        filter: creatorFilter + featuredFilter + modFilter,
        ...options
    });
}

// Pocketbase gives results in a weird format,
// so we need to convert it to a POJO (plain old javascript object)
// so sveltekit won't complain
// TODO: ...also, this does more than just "toPOJO"... see cleanObject
// moveExpandsInline from pocketbase-expandless does not work...
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

// removes the weird "expand" properties
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

function getSort(sortCode: number) {
    switch (sortCode) {
        case 0:
            return "-created";
        case 1:
            return "created";
        case 2:
            return "-plays";
        // case 3:
        //  return "stars"
        default:
            return "";
    }
}
