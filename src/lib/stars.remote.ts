import { command, getRequestEvent, query } from "$app/server";
import z from "zod";
import { primitives } from "./parse";

/** Counts and stuff are handled in the backend pb_hooks */
export const operateStar = command(
    z.object({ id: primitives.id, type: primitives.type }),
    async ({ id, type }) => {
        const {
            locals: { user, pb }
        } = getRequestEvent();
        const collection = type ? "5beam_levelpack_stars" : "5beam_level_stars";

        // It shouldn't even be possible to run this without being logged in
        // TODO: See if I can have user just be non-nullable here
        if (!user) {
            throw new Error("Not logged in");
        }

        // 1. Check if the user has already starred this item
        const userId = user.record.id;

        const filter = pb.filter(`creator = {:creator} && item = {:item}`, {
            creator: userId,
            item: id
        });

        try {
            const existingStar = await pb.collection(collection).getFirstListItem(filter);

            await pb.collection(collection).delete(existingStar.id);
            return { starred: false };
        } catch {
            await pb.collection(collection).create({ creator: userId, item: id });
            return { starred: true };
        }
    }
);

export const hasUserStarred = query(
    z.object({ id: primitives.id, type: primitives.type }),
    async ({ id, type }) => {
        const {
            locals: { user, pb }
        } = getRequestEvent();

        if (!user) {
            throw new Error("Not logged in");
        }

        const collection = type ? "5beam_levelpack_stars" : "5beam_level_stars";
        const filter = pb.filter(`creator = {:creator} && item = {:item}`, {
            creator: user.record.id,
            item: id
        });
        try {
            await pb.collection(collection).getFirstListItem(filter);

            return true;
        } catch {
            return false;
        }
    }
);

/** @deprecated */
export const hasUserStarredLevels = command(z.array(primitives.id), async (ids) => {
    const {
        locals: { user, pb }
    } = getRequestEvent();

    if (!user) {
        throw new Error("Not logged in");
    }

    const itemsFilter = ids.map((id) => `id = "${id}"`).join(" || ");

    const filter = pb.filter(`creator = {:creator} && ({:items})`, {
        creator: user.record.id,
        items: itemsFilter
    });
    return await pb.collection("5beam_levels_stars").getList(1, ids.length, { options: filter });
});
