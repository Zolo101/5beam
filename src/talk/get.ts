import { dailyies, levelpacks, levels, users, weeklies } from "$lib/pocketbase";
import type { Daily, Level, Levelpack, PocketbaseUser, WeeklyChallenge } from "$lib/types";
import { ClientResponseError, type RecordListOptions, type RecordService } from "pocketbase";
// TODO: Create a class (so we dont need to repeat toPOJO everywhere)

export async function getDaily() {
    const daily = toPOJO(
        await dailyies.getList<Daily>(1, 1, {
            expand: "level,level.creator",
            filter: "featured = false"
        })
    ).items;

    if (daily.length === 0) {
        return null;
    } else {
        return daily;
    }
}

export async function getWeeklyChallenge() {
    return toPOJO(
        (
            await weeklies.getList<WeeklyChallenge>(1, 1, {
                expand: "creator",
                sort: "-created"
            })
        ).items
    );
}

export async function getLevels(
    page: number,
    sortCode: number,
    featured: boolean,
    mod: string,
    options?: RecordListOptions
) {
    const sort = getSort(sortCode);
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = mod ? `modded = "${mod}"` : `modded = ""`;

    return toPOJO(
        (
            await levels.getList<Level>(page, 8, {
                expand: "creator",
                sort,
                filter: featuredFilter + modFilter,
                ...options
            })
        ).items
    );
}

export async function getRandomLevels(
    amount: number,
    type: number,
    featured: boolean,
    mod: string
) {
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = mod ? `modded = "${mod}"` : `modded = ""`;
    const db = type ? levelpacks : levels;

    // TODO: Do this function without getting every level in the database.
    const everyRecord = await db.getList<Level | Levelpack>(0, amount, {
        expand: "creator",
        filter: "unlisted = false && " + featuredFilter + modFilter,
        sort: "@random"
    });

    return toPOJO(everyRecord.items);
}

export async function getLevelpacks(
    page: number,
    sortCode: number,
    featured: boolean,
    mod: string,
    options?: RecordListOptions
) {
    const sort = getSort(sortCode);
    const featuredFilter = featured ? "featured = true && " : "";
    const modFilter = mod ? `modded = "${mod}"` : `modded = ""`;

    return toPOJO(
        (
            await levelpacks.getList<Levelpack>(page, 8, {
                expand: "creator",
                sort,
                filter: featuredFilter + modFilter,
                ...options
            })
        ).items
    );
}

// TODO: Merge with getLevelpackById
export async function getLevelpackByIdWithLevels(id: string) {
    return toPOJO(await levelpacks.getOne<Levelpack>(id, { expand: "creator, levels.creator" }));
}

export async function getLevelById(id: string) {
    try {
        return toPOJO(await levels.getOne<Level>(id, { expand: "creator" }));
    } catch (e) {
        // 404 -- Not found
        if (e instanceof ClientResponseError && e.status === 404) {
            return null;
        }
        throw e;
    }
}

export async function getLevelpackById(id: string) {
    try {
        return toPOJO(await levelpacks.getOne<Levelpack>(id, { expand: "creator" }));
    } catch (e) {
        // 404 -- Not found
        if (e instanceof ClientResponseError && e.status === 404) {
            return null;
        }
        throw e;
    }
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

// TODO: Fulltext search?
export async function getSearch(text: string, page: number, mod: string) {
    const filter = mod
        ? `title ~ "${text}" && modded = "${mod}"`
        : `title ~ "${text}" && modded = ""`; // TODO: Is this unsafe / escapable?

    return toPOJO(
        (
            await levels.getList<Level>(page, 12, {
                expand: "creator",
                filter
            })
        ).items
    );
}

export async function getUserById(id: string) {
    // return await getDoc(doc(collection(db, "users"), id))

    try {
        return toPOJO(await users.getOne<PocketbaseUser>(id));
    } catch (e) {
        // 404 -- Not found
        if (e instanceof ClientResponseError && e.status === 404) {
            return null;
        }
        throw e;
    }
}

export async function getUserByDiscordId(discordId: string) {
    // return await getDoc(doc(collection(db, "users"), id))

    return toPOJO(await users.getFirstListItem<PocketbaseUser>(`discordId = "${discordId}"`));
}

// TODO: Why do we need requestKey: null when requesting both getUserLevels and getUserLevelpacks?
export async function getUserLevels(
    id: string,
    page: number,
    sortCode: number,
    featured: boolean,
    mod: string,
    options?: RecordListOptions
) {
    // const levels = query(collection(db, "users", id, "levels"), limit(amount));
    // return await getDocs(levels);
    const sort = getSort(sortCode);
    const featuredFilter = featured ? "featured = true" : "";
    const modFilter = mod ? `modded = "${mod}"` : `modded = ""`;

    // TODO: We dont need to get the user, we probably already got it... (new property in getLevels needed)
    const userLevels = toPOJO(
        await users.getOne<PocketbaseUser>(id, {
            sort,
            filter: featuredFilter + modFilter,
            ...options
        })
    ).levels;

    return toPOJO((await getListIdPage<Level>(levels, page, 4, userLevels, "creator")).items);
}

export async function getUserLevelpacks(
    id: string,
    page: number,
    sortCode: number,
    featured: boolean,
    mod: string,
    options?: RecordListOptions
) {
    const sort = getSort(sortCode);
    const featuredFilter = featured ? "featured = true" : "";
    const modFilter = mod ? `modded = "${mod}"` : `modded = ""`;

    const userLevelpacks = toPOJO(
        await users.getOne<PocketbaseUser>(id, {
            sort,
            filter: featuredFilter + modFilter,
            ...options
        })
    ).levelpacks;

    return toPOJO(
        (await getListIdPage<Levelpack>(levelpacks, page, 4, userLevelpacks, "creator")).items
    );
}

// Pocketbase gives results in a weird format,
// so we need to convert it to a POJO (plain old javascript object)
// so sveltekit won't complain
// TODO: ...also, this does more than just "toPOJO"... see cleanObject
// moveExpandsInline from pocketbase-expandless does not work...
export function toPOJO<T extends Record<string, unknown> | Record<string, unknown>[]>(
    obj: T
): T | null {
    if (obj === undefined || obj === null) return null;

    const result = Array.isArray(obj)
        ? structuredClone(obj.map(cleanObject))
        : structuredClone(cleanObject(obj));
    return result as T;
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

export async function updateFetch<T>(
    collection: RecordService,
    id: string,
    body: Record<string, unknown>
) {
    const result = await fetch(
        `https://cdn.zelo.dev/api/collections/${collection.collectionIdOrName}/records/${id}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                // TODO: Stop doing this
                // no but really stop doing this
                secret: import.meta.env.VITE_POCKETBASE_USER_SECRET
            },
            body: JSON.stringify(body)
        }
    );

    return (await result.json()) as Promise<T>;
}

export async function updateFetchFormData<T>(
    collection: RecordService,
    id: string,
    body: FormData
) {
    const result = await fetch(
        `https://cdn.zelo.dev/api/collections/${collection.collectionIdOrName}/records/${id}`,
        {
            method: "PATCH",
            headers: {
                secret: import.meta.env.VITE_POCKETBASE_USER_SECRET
            },
            body: body
        }
    );

    return (await result.json()) as Promise<T>;
}

function getListIdPage<T>(
    collection: RecordService,
    page: number,
    amount: number,
    ids: string[],
    expand: string
) {
    return collection.getList<T>(page, amount, {
        filter: ids.map((id) => `id="${id}"`).join("||"),
        expand
    });
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
