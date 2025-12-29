import { adminPb } from "./adminPocketbase";

// Note: we cannot use Buffer, thats node.js only, also
// we cannot use .toHex() as its too new
export async function getLevelDataHash(levelData: string) {
    const levelDataUint8 = new TextEncoder().encode(levelData);
    const hashBuffer = await crypto.subtle.digest("SHA-256", levelDataUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

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
