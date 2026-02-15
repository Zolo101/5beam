import { getLevelById, getLevelpackByIdWithLevels } from "$lib/get.remote";
import type { Level, Levelpack } from "$lib/types";
import type { PageServerLoad } from "./$types";

type LevelItem = {
    type: "level";
    item: Level;
};

type LevelpackItem = {
    type: "levelpack";
    item: Omit<Levelpack, "levels"> & {
        levels: Level[];
    };
};

// type PlaylistItem = {
//     type: "playlist";
//     playlist: Playlist
// }

export const load = (async ({ params }) => {
    const { type, id } = params;
    switch (type) {
        case "level": {
            const level = await getLevelById(id);
            return { thing: { type: "level", item: level } as LevelItem };
        }

        case "levelpack": {
            const levelpack = await getLevelpackByIdWithLevels(id);
            return { thing: { type: "levelpack", item: levelpack } as LevelpackItem };
        }

        // case "playlist": {
        //     const level = await getLevelById(id);
        //     return { type: "level", item: level };
        // }

        default:
            throw new Error("Invalid type");
    }
}) satisfies PageServerLoad;
