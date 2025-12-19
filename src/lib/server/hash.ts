import { adminPb } from "./adminPocketbase";

export async function getLevelDataHash(levelData: string) {
    const levelDataUint8 = new TextEncoder().encode(levelData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", levelDataUint8);
    const hash = Buffer.from(hashBuffer).toString("hex");
    return hash;
}

/** Checks if a level's data is unique to a user, preventing duplicate levels */
export async function isLevelUniqueToUser(levelData: string, userId: string) {
    const hash = await getLevelDataHash(levelData);

    // Unlisted levels are allowed to be duplicates (like levelpacks levels)
    const filter = adminPb.filter(`creator = {:userId} && unlisted = false && dataHash = {:hash}`, {
        userId,
        hash
    });

    // adminPb because clientPb(...)getFullList won't get everything(???)
    const duplicatedLevelsFromUser = await adminPb
        .collection("5beam_levels")
        .getFullList({ filter });

    return duplicatedLevelsFromUser;
}
