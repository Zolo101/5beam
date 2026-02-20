import { getRequestEvent } from "$app/server";
import { getLevelById, getLevelpackById } from "$lib/get.remote";
import { isAdmin } from "$lib/misc";
import { DENIED, NOT_FOUND, OK, MY_BAD } from "./misc";
import { RemoveItemWebhook } from "./webhook";

export async function _deleteLevel({ id }: { id: string }) {
    const {
        locals: { user, pb }
    } = getRequestEvent();
    if (!user) return DENIED();

    try {
        const level = await getLevelById(id);
        if (!level) return NOT_FOUND();
        if (!level.creator) return DENIED(); // A Guest made this

        const allowed = user.record.id === level.creator.id || isAdmin(user);
        if (!allowed) return DENIED();

        await pb.collection("5beam_levels").delete(id);
        await RemoveItemWebhook.send(level);

        return OK();
    } catch {
        return MY_BAD();
    }
}

export async function _deleteLevelpack({ id, cascade }: { id: string; cascade?: boolean }) {
    const {
        locals: { user, pb }
    } = getRequestEvent();
    if (!user) return DENIED();

    console.log(id, cascade);
    try {
        const levelpack = await getLevelpackById(id);
        if (!levelpack) return NOT_FOUND();
        if (!levelpack.creator) return DENIED(); // A Guest made this

        const allowed = user.record.id === levelpack.creator.id || isAdmin(user);
        if (!allowed) return DENIED();

        if (cascade) {
            // Delete it all
            await Promise.all(
                levelpack.levels.map((levelId) => pb.collection("5beam_levels").delete(levelId))
            );
        } else {
            // Re-list it all
            await Promise.all(
                levelpack.levels.map((levelId) =>
                    pb.collection("5beam_levels").update(levelId, { unlisted: false })
                )
            );
        }

        // Pocketbase will delete the levelpack automatically
        // await pb.collection("5beam_levelpacks").delete(id);
        await RemoveItemWebhook.send(levelpack);

        return OK();
    } catch {
        return MY_BAD();
    }
}
