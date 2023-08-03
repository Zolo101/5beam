import {levels, users} from "$lib/pocketbase";
import type {Level, User} from "$lib/types";
// TODO: Create a class (so we dont need to repeat toPOJO everywhere)

// TODO: Implement sort, also what is x?
export async function getLevels(page: number, sort: any, x: any) {
    // return await prisma.level.findMany({
    //     skip: offset,
    //     take: amount,
    //     include: {
    //         creator: true,
    //     },
    //     where: {
    //         levelpackId: null,
    //         ...props,
    //     },
    //     orderBy: sort,
    // })

    // TODO: filter
    return toPOJO((await levels
        .getList<Level>(page, 8, {expand: "creator"})
    ).items)
}

// export async function getLevelpacks(amount: number, offset: number, sort: any, props: Prisma.LevelpackWhereInput) {
//     return await prisma.levelpack.findMany({
//         skip: offset,
//         take: amount,
//         include: {
//             creator: true,
//         },
//         where: props,
//         orderBy: sort,
//     })
// }

export async function getLevelById(id: string) {
    return toPOJO((await levels.getOne<Level>(id, {expand: "creator"})))
}

// export async function getLevelpackByProps(props: Prisma.LevelpackWhereUniqueInput) {
//     return await prisma.levelpack.findUnique({
//         where: props,
//         include: {
//             levels: {
//                 include: {
//                     creator: true
//                 }
//             },
//             creator: true,
//         }
//     })
// }

// TODO: Fulltext search?
export async function getSearch(text: string, amount: number) {
    // const search = query(collection(db, "levels"), where("title", ">=", text), limit(amount))
    // return await getDocs(search)

    return toPOJO((await levels
        .getList<Level>(1, 8, {
            filter: `title ~ ${text}`, // TODO: Is this unsafe?
        })
    ).items)
}

export async function getUserById(id: string) {
    // return await getDoc(doc(collection(db, "users"), id))

    return toPOJO(await users.getOne<User>(id));
}

export async function getUserLevels(id: string, page: number) {
    // const levels = query(collection(db, "users", id, "levels"), limit(amount));
    // return await getDocs(levels);

    // TODO: We dont need to get the user, we probably already got it... (new property in getLevels needed)
    return toPOJO((await users
        .getOne(id, {expand: "levels.creator"})
    ).expand.levels)
}

// Pocketbase gives results in a weird format,
// so we need to convert it to a POJO (plain old javascript object)
// so sveltekit won't complain
async function toPOJO<T>(obj: T) {
    return structuredClone(obj);
}

// export async function getUserLevelpacks(props: Prisma.LevelWhereInput, amount: number, offset: number) {
//     return await prisma.levelpack.findMany({
//         where: props,
//         skip: offset,
//         take: amount,
//         include: {
//             creator: true,
//         }
//     })
// }
