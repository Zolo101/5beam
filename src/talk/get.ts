import { levelpacks, levels, users } from "$lib/pocketbase";
import type { Level, Levelpack, PocketbaseUser } from "$lib/types";
// TODO: Create a class (so we dont need to repeat toPOJO everywhere)

// TODO: Implement sort, also what is x?
export async function getLevels(page: number, sortCode: number, featured: boolean) {
    let sort = getSort(sortCode)
    const filter = featured ? "featured = true" : ""

    return toPOJO((await levels
        .getList<Level>(page, 8, {
            expand: "creator",
            sort,
            filter
        })
    ).items)
}

export async function getLevelpacks(page: number, sortCode: number, featured: boolean) {
    let sort = getSort(sortCode)
    const filter = featured ? "featured = true" : ""

    return toPOJO((await levelpacks
        .getList<Levelpack>(page, 8, {
            expand: "creator",
            sort,
            filter
        })
    ).items)
}

// TODO: Merge with getLevelpackById
export async function getLevelpackByIdWithLevels(id: string) {
    return toPOJO((await levelpacks.getOne<Levelpack>(id, {expand: "creator, levels.creator"})))
}

export async function getLevelById(id: string) {
    const result = toPOJO((await levels.getOne<Level>(id, {expand: "creator"})))
    await levels.update<Level>(id, {views: result.views + 1})

    return result
}

export async function getLevelpackById(id: string) {
    const result = toPOJO((await levelpacks.getOne<Levelpack>(id, {expand: "creator"})))
    await levelpacks.update<Levelpack>(id, {views: result.views + 1})

    return result
}

// TODO: Fulltext search?
export async function getSearch(text: string, page: number) {
    return toPOJO((await levels
        .getList<Level>(page, 8, {
            filter: `title ~ "${text}"`, // TODO: Is this unsafe / escapable?
        })
    ).items)
}

export async function getUserById(id: string) {
    // return await getDoc(doc(collection(db, "users"), id))

    return toPOJO(await users.getOne<PocketbaseUser>(id));
}

// deprecate maybe
// export async function getUserByDiscordId(discordId: string) {
//     // return await getDoc(doc(collection(db, "users"), id))
//
//     return toPOJO(await users.g<PocketbaseUser>(discordId));
// }

export async function getUserLevels(id: string, page: number, sortCode: number, featured: boolean) {
    // const levels = query(collection(db, "users", id, "levels"), limit(amount));
    // return await getDocs(levels);
    let sort = getSort(sortCode)
    const filter = featured ? "featured = true" : ""

    // TODO: We dont need to get the user, we probably already got it... (new property in getLevels needed)
    return toPOJO((await users
        .getOne<PocketbaseUser>(id, {
            expand: "levels.creator",
            sort,
            filter
        })
    ).expand.levels as Level[])
}

export async function getUserLevelpacks(id: string, page: number, sortCode: number, featured: boolean) {
    let sort = getSort(sortCode)
    const filter = featured ? "featured = true" : ""

    return toPOJO((await users
            .getOne<PocketbaseUser>(id, {
                expand: "levelpacks.creator",
                sort,
                filter
            })
    ).expand.levelpacks as Levelpack[])
}

// Pocketbase gives results in a weird format,
// so we need to convert it to a POJO (plain old javascript object)
// so sveltekit won't complain
// TODO: ...also, this does more than just "toPOJO"
// TODO: import { moveExpandsInline } from "pocketbase-expandless";
export function toPOJO<T extends Record<string, any> | Record<string, any>[]>(obj: T): T {
    const result = Array.isArray(obj)
        ? structuredClone(obj.map(cleanObject))
        : structuredClone(cleanObject(obj));
    return result as T;
}

// removes the weird "expand" properties
function cleanObject(obj: Record<string, any>) {
    // TODO: Figure out why getUserLevelpacks gives undefined objects
    if (obj === undefined) {
        console.trace("undefined in cleanObject()")
        return {}
    };

    delete obj.collectionId;
    delete obj.collectionName;

    const expand = obj.expand;
    if (expand) {
        if (Object.keys(expand).length === 0) delete obj.expand

        for (const key in expand) {
            const prop = expand[key]

            if (Array.isArray(prop)) {
                if (prop.length > 0) expand[key] = prop.map(cleanObject)
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
            return "-created"
        case 1:
            return "created"
        case 2:
            return "-views"
        // case 3:
        //  return "stars"
        default:
            return ""
    }
}