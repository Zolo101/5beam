import { dailyies, levelpacks, levels, pb, usersV2, weeklies } from "$lib/pocketbase";
import type { BaseUserV2, Daily, Level, Levelpack, WeeklyChallenge } from "$lib/types";
import { ClientResponseError, type RecordListOptions, type RecordService } from "pocketbase";
// TODO: Create a class (so we dont need to repeat toPOJO everywhere)

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
    const modFilter = pb.filter(`modded = {:mod}`, { mod });

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
        filter: pb.filter(`unlisted = false && {:featured} {:mod}`, {
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
    const modFilter = pb.filter(`modded = {:mod}`, { mod });

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
        filter: pb.filter(`id != {:id} && modded = {:modded} && difficulty = {:difficulty}`, {
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
    const modFilter = pb.filter(`modded = {:mod}`, { mod });
    const range = 1000 * 60 * 60 * 24 * 14; // 2 weeks
    const date = new Date(Date.now() - range).toISOString().replace("T", " ").substring(0, 19);
    const filter = pb.filter(modFilter + " && created >= {:date}", { date });

    return await levels.getList<Level>(page, amount, {
        expand: "creator",
        sort: "-plays",
        filter,
        ...options
    });
}

export async function addPlayLevel(id: string) {
    const result = await getLevelById(id);
    await updateFetch<Level>(levels, id, { plays: result.plays + 1 });

    return result;
}

export async function addPlayLevelpack(id: string) {
    const result = await getLevelpackById(id);
    await updateFetch<Levelpack>(levelpacks, id, { plays: result.plays + 1 });

    return result;
}

export async function getSearch(
    text: string,
    page: number,
    amount: number,
    mod: string | undefined
) {
    return await levels.getList<Level>(page, amount, {
        expand: "creator",
        filter: pb.filter(`title ~ {:text} && modded = {:mod}`, { text, mod })
    });
}

export async function getUserById(id: string) {
    try {
        return await usersV2.getOne<BaseUserV2>(id);
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
    const featuredFilter = featured ? "featured = true" : "";
    const modFilter = mod ? `modded = "${mod}"` : "";
    let filter = featuredFilter + modFilter;
    if (filter.length > 0) filter = " && " + filter;

    return await levels.getList<Level>(page, amount, {
        expand: "creator",
        filter: pb.filter(`creator = {:id} {:filter}`, { id, filter }),
        sort,
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
    const featuredFilter = featured ? "featured = true" : "";
    const modFilter = mod ? `modded = "${mod}"` : "";
    let filter = featuredFilter + modFilter;
    if (filter.length > 0) filter = " && " + filter;

    return await levelpacks.getList<Levelpack>(page, amount, {
        expand: "creator",
        filter: pb.filter(`creator = {:id} {:filter}`, { id, filter }),
        sort,
        ...options
    });
}

export async function updateFetch<T>(
    collection: RecordService<T>,
    id: string,
    body: Partial<T> | FormData
) {
    return await collection.update(id, body);
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
