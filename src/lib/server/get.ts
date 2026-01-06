import {
    dailyies,
    levelpacks,
    levels,
    clientPb,
    usersV2,
    weeklies,
    levelpackStars,
    levelStars
} from "$lib/clientPocketbase";
import type { Level, Levelpack, Report } from "$lib/types";
import { ReportWebhook } from "$lib/server/webhook";
import { ClientResponseError, type RecordListOptions } from "pocketbase";
import { error } from "@sveltejs/kit";

export async function getDaily() {
    const daily = await dailyies.getList(1, 1, {
        filter: "featured = false",
        expand: "level,level.creator"
    });

    return daily;
}

export async function getWeeklyChallenge() {
    return await weeklies.getList(1, 1, {
        expand: "creator",
        sort: "-created"
    });
}

// export async function getLevels(
//     page: number,
//     sortCode: number,
//     featured: boolean,
//     mod: string,
//     amount: number,
//     options?: RecordListOptions
// ) {
//     const sort = getSort(sortCode);
//     const featuredFilter = featured ? "featured = true && " : "";
//     const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

//     return await levels.getList(page, amount, {
//         expand: "creator",
//         sort,
//         filter: featuredFilter + modFilter,
//         ...options
//     });
// }

export async function getRandomLevels(
    amount: number,
    type: number,
    featured: boolean,
    mod: string
) {
    const db = type ? levelpacks : levels;

    return weirdAhhQuery(
        () =>
            db.getList<Level | Levelpack>(0, amount, {
                expand: "creator",
                filter: clientPb.filter(
                    `unlisted = false && featured = {:featured} && modded = {:mod}`,
                    {
                        featured,
                        mod
                    }
                ),
                sort: "@random"
            }),
        {
            404: "Could not get random levels"
        }
    );
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

    return await levelpacks.getList(page, amount, {
        expand: "creator",
        sort,
        filter: featuredFilter + modFilter,
        ...options
    });
}

// TODO: Merge with getLevelpackById
export async function getLevelpackByIdWithLevels(id: string) {
    return weirdAhhQuery(
        () =>
            levelpacks.getOne<
                Omit<Levelpack, "levels"> & {
                    levels: Level[];
                }
            >(id, { expand: "creator, levels.creator" }),
        {
            404: "Levelpack not found"
        }
    );
}

export async function getLevelById(id: string) {
    return weirdAhhQuery(() => levels.getOne<Level>(id, { expand: "creator" }), {
        404: "Level not found"
    });
}

export async function getLevelpackById(id: string) {
    return weirdAhhQuery(() => levelpacks.getOne(id, { expand: "creator" }), {
        404: "Levelpack not found"
    });
}

export async function getRelatedLevels(level: Level) {
    return await levels.getList(1, 4, {
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

    return await levels.getList(page, amount, {
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
    return await levels.getList(page, amount, {
        expand: "creator",
        filter: clientPb.filter(`title ~ {:text} && modded = {:mod}`, { text, mod })
    });
}

export async function getUserById(id: string) {
    return weirdAhhQuery(() => usersV2.getOne(id), {
        404: "User not found"
    });
}

/** Gets ALL starred items based on type. */
export async function getUserAllStarredItems(
    id: string,
    type: number,
    options?: RecordListOptions
) {
    const collection = type ? levelpackStars : levelStars;
    const filter = clientPb.filter(`user = {:id}`, { id });

    // I think there's a bug with getFullList, it... just doesn't work unless your admin??
    return (
        await collection.getList(1, 9999, { expand: "item,item.creator", filter, ...options })
    ).map((v) => v.item);
}

export async function getUserStarredItems(
    id: string,
    page: number,
    type: number,
    sortCode: number,
    featured: boolean,
    amount: number,
    mod: string | undefined,
    options?: RecordListOptions
) {
    const collection = type ? levelpackStars : levelStars;
    const sort = getSort(sortCode);
    const creatorFilter = clientPb.filter(`user = {:id} && `, { id });
    const featuredFilter = featured ? "item.featured = true && " : "";
    const modFilter = clientPb.filter(`item.modded = {:mod}`, { mod });

    return (
        await collection.getList(page, amount, {
            expand: "item,item.creator",
            sort,
            filter: creatorFilter + featuredFilter + modFilter,
            ...options
        })
    ).map((v) => v.item);
}

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

    return await levels.getList(page, amount, {
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

    return await levelpacks.getList(page, amount, {
        expand: "creator",
        sort,
        filter: creatorFilter + featuredFilter + modFilter,
        ...options
    });
}

export async function reportKindById(
    id: string,
    reportKind: string,
    reportReason: string,
    reportDesc: string | undefined
) {
    const report: Report = await clientPb.collection("5beam_reports").create({
        reportedId: id,
        kind: reportKind,
        reason: reportReason,
        description: reportDesc
    });

    await ReportWebhook.send(report);
    return report;
}

// TODO: Can we please use remote functions instead??
/** @deprecated */
export async function weirdAhhQuery<T>(func: () => Promise<T>, r: Record<number, string>) {
    try {
        return await func();
    } catch (e) {
        const {
            response: { status }
        } = e as ClientResponseError;

        throw error(status, r[status] || "An unknown error occurred");
    }
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
