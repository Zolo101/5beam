import { db } from "$lib/firebase-server";
import type { DocumentSnapshot, QuerySnapshot } from "firebase-admin/firestore";
import { FieldPath } from "firebase-admin/firestore";
import { mergeObjects } from "../misc";

export async function getLevels(amount: number, offset: number, sort: any, x: any) {
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
    const levelsSnapshot = await db
        .collection("levels")
        .limit(25)
        .get()

    return evaluateSnapshot(levelsSnapshot);
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
    return evaluateDocumentSnapshot(
        await db
        .collection("levels")
        .doc(id)
        .get()
    )
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

    const searchSnapshot = await db
        .collection("levels")
        .where("title", ">=", text)
        .limit(amount)
        .get()

    return evaluateSnapshot(searchSnapshot);
}

export async function getUserById(id: string) {
    // return await getDoc(doc(collection(db, "users"), id))

    return evaluateDocumentSnapshot(
        await db
        .collection("users")
        .doc(id)
        .get()
    )
}

// TODO: Pagination (offset)
export async function getUserLevels(id: string, amount: number, offset: number) {
    // const levels = query(collection(db, "users", id, "levels"), limit(amount));
    // return await getDocs(levels);

    const userDoc = (
        await db
        .collection("users")
        .doc(id)
        .get()
    )
        .data()!

    const levelsSnapshot = await db
        .collection("levels")
        .where(FieldPath.documentId(), "in", userDoc.levels)
        .get()

    return evaluateSnapshot(levelsSnapshot);
}

function evaluateSnapshot(snapshot: QuerySnapshot) {
    return JSON.stringify(snapshot.docs.map(doc => mergeObjects(doc.data(), {id: doc.id})));
}

function evaluateDocumentSnapshot(snapshot: DocumentSnapshot) {
    return JSON.stringify(mergeObjects(snapshot.data(), {id: snapshot.id}));
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

