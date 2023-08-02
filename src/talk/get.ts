import { levels, users } from "$lib/pocketbase";
import type { Level, User } from "$lib/types";

// TODO: What is x
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

    return (await levels
        .getList<Level>(page, 8, {
            // TODO: filter
            expand: "creator",
        })
    ).items
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
    return levels.getOne<Level>(id)
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

    return (await levels
        .getList<Level>(1, 8, {
            filter: `title ~ ${text}`, // TODO: Is this unsafe?
        })
    ).items
}

export async function getUserById(id: string) {
    // return await getDoc(doc(collection(db, "users"), id))

    return users.getOne<User>(id);
}

export async function getUserLevels(id: string, page: number) {
    // const levels = query(collection(db, "users", id, "levels"), limit(amount));
    // return await getDocs(levels);

    // TODO: We dont need to get the user, we probably already got it... (new property in getLevels needed)
    return (await users
        .getOne(id, {expand: "levels.creator"})
    ).expand.levels
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
