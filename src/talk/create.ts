import type { CreateLevel, User } from "$lib/types";

let user: User;

export async function createLevel(obj: CreateLevel) {
    // const newDocumentRef = db.collection("posts").doc();
    // const finalLevel = mergeObjects(obj, {
    //     creator: user,
    //     created: Timestamp.now(),
    //     plays: 0,
    //     difficulty: 0,
    //     featured: false
    // })
    //
    // return await newDocumentRef.create(finalLevel)
}

// export async function createLevelpack(obj: Prisma.LevelpackCreateArgs["data"]) {
//     return await prisma.levelpack.create({ data: obj })
// }


// TODO: I'll do this via functions
// export async function createUser(obj: Crewa]) {
//     return await prisma.user.create({ data: obj })
// }