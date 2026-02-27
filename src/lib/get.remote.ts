import { query } from "$app/server";
import z from "zod";
import {
    dailyies,
    levelpacks,
    levelpackStars,
    levels,
    levelStars,
    trending,
    usersV2,
    weeklies
} from "./clientPocketbase";
import * as pbf from "@nedpals/pbf";
import { primitives } from "./parse";

// TODO: Get better names & make sure only the (maybe) ones are optional
const creatorFilter = (v: string) => pbf.eq("creator", v);
/** Be aware: If `v` is false or undefined, it means we don't care */
const optionalFeaturedOnly = (v?: boolean) => pbf.eq.maybe("featured", v);
const modFilter = (v: string) => pbf.eq("modded", v);
const titleFilter = (v?: string) => pbf.like.maybe("title", v);
/** Be aware: If `v` is false, it means we don't care */
const charactersFilter = (v?: string[]) =>
    v !== undefined &&
    v.length > 0 &&
    pbf.and.maybe(
        pbf.eq("characters:length", v.length),
        ...v.map((v) => pbf.like("characters", v))
    );
const ignoreUnlisted = pbf.eq("unlisted", false);

const pageSchema = z.object({
    page: z.number().min(1),
    sortCode: z.number().min(0).max(3),
    featured: z.boolean().optional(),
    mod: z.string(),
    amount: z.number(),
    areaCode: z.number().optional(),
    characters: z.array(z.string()).optional(),
    options: z.record(z.any(), z.any()).optional()
});

// TODO: We should make a pocketbase level type schema
const relatedSchema = z.object({
    id: primitives.id,
    modded: primitives.modded,
    difficulty: primitives.difficulty
});

export const getDaily = query(async () => {
    const daily = await dailyies.getList(1, 1, {
        filter: "featured = false",
        expand: "level,level.creator"
    });

    return daily;
});

export const getWeeklyChallenge = query(async () => {
    return await weeklies.getList(1, 1, {
        sort: "-created",
        expand: "creator"
    });
});

export const getLevelById = query(z.string(), async (id) => {
    return await levels.getOne(id, { expand: "creator" });
});

export const getLevels = query(
    pageSchema,
    async ({ page, sortCode, featured, mod, amount, options }) => {
        const filter = pbf.stringify(pbf.and.maybe(optionalFeaturedOnly(featured), modFilter(mod)));
        const sort = getSort(sortCode);

        return await levels.getList(page, amount, {
            expand: "creator",
            sort,
            filter,
            ...options
        });
    }
);

export const getRandomLevels = query(
    pageSchema,
    async ({ page, featured, mod, amount, options }) => {
        const filter = pbf.stringify(
            pbf.and.maybe(optionalFeaturedOnly(featured), modFilter(mod), ignoreUnlisted)
        );

        return await levels.getList(page, amount, {
            expand: "creator",
            sort: "@random",
            filter,
            ...options
        });
    }
);

export const getLevelpackById = query(z.string(), async (id) => {
    return await levelpacks.getOne(id, { expand: "creator" });
});

// TODO: Merge with getLevelpackById
export const getLevelpackByIdWithLevels = query(z.string(), async (id) => {
    return await levelpacks.getOne(id, { expand: "creator,levels,levels.creator" });
});

export const getLevelpacks = query(
    pageSchema,
    async ({ page, sortCode, featured, mod, amount, options }) => {
        const filter = pbf.stringify(pbf.and.maybe(optionalFeaturedOnly(featured), modFilter(mod)));
        const sort = getSort(sortCode);

        return await levelpacks.getList(page, amount, {
            expand: "creator",
            sort,
            filter,
            ...options
        });
    }
);

export const getRelatedLevels = query(relatedSchema, async ({ id, modded, difficulty }) => {
    const filter = pbf.stringify(
        pbf.and.maybe(
            pbf.not(pbf.eq("id", id)),
            modFilter(modded),
            pbf.eq("difficulty", difficulty)
        )
    );

    return await levels.getList(1, 4, {
        expand: "creator",
        sort: "@random",
        filter
    });
});

const trendingSchema = pageSchema.pick({ page: true, amount: true, mod: true, options: true });
export const getTrendingLevels = query(trendingSchema, async ({ page, amount, mod, options }) => {
    const filter = pbf.stringify(pbf.and.maybe(modFilter(mod)));

    return await trending.getList(page, amount, {
        expand: "creator",
        filter,
        ...options
    });
});

// TODO: Whats the difference between this and getLevels?
// TODO: Make this nonempty
export const getLevelSearch = query(
    z.object({ ...pageSchema.shape, text: z.string() }),
    async ({ text, page, sortCode, featured, mod, areaCode, characters, amount, options }) => {
        const sort = getSort(sortCode);
        const filter = pbf.stringify(
            pbf.and.maybe(
                optionalFeaturedOnly(featured),
                modFilter(mod),
                titleFilter(text),
                getArea(areaCode),
                charactersFilter(characters)
            )
        );

        return await levels.getList(page, amount, {
            expand: "creator",
            sort,
            filter,
            ...options
        });
    }
);

export const getLevelpackSearch = query(
    z.object({ ...pageSchema.shape, text: z.string() }),
    async ({ text, page, sortCode, featured, mod, amount, options }) => {
        const sort = getSort(sortCode);
        const filter = pbf.stringify(
            pbf.and.maybe(optionalFeaturedOnly(featured), modFilter(mod), titleFilter(text))
        );

        return await levelpacks.getList(page, amount, {
            expand: "creator",
            sort,
            filter,
            ...options
        });
    }
);

export const getUserById = query(z.string(), async (id) => {
    return await usersV2.getOne(id);
});

export const getUserLevels = query(
    z.object({ ...pageSchema.shape, id: z.string() }),
    async ({ id, page, sortCode, featured, amount, mod, options }) => {
        const sort = getSort(sortCode);
        const filter = pbf.stringify(
            pbf.and.maybe(creatorFilter(id), optionalFeaturedOnly(featured), modFilter(mod))
        );

        return await levels.getList(page, amount, {
            expand: "creator",
            sort,
            filter,
            ...options
        });
    }
);

export const getUserLevelpacks = query(
    z.object({ ...pageSchema.shape, id: z.string() }),
    async ({ id, page, sortCode, featured, amount, mod, options }) => {
        const sort = getSort(sortCode);
        const filter = pbf.stringify(
            pbf.and.maybe(creatorFilter(id), optionalFeaturedOnly(featured), modFilter(mod))
        );

        return await levelpacks.getList(page, amount, {
            expand: "creator",
            sort,
            filter,
            ...options
        });
    }
);

// TODO: We cant filter here (FUTURE ZELO: ...WHY NOT?) EXPLAIN!!!
export const getUserLevelStars = query(
    z.object({ ...pageSchema.shape, id: z.string() }),
    async ({ id, page, sortCode, featured, amount, mod, options }) => {
        const sort = getSort(sortCode);
        // const creatorFilter = clientPb.filter(`user = {:id} && `, { id });

        // TODO: Put in API docs: creator of the star, NOT the level/levelpack.
        // const creatorFilter = clientPb.filter(`creator = {:id}`, { id });

        // const featuredFilter = featured ? "featured = true && " : "";
        // const modFilter = clientPb.filter(`modded = {:mod}`, { mod });
        const filter = pbf.stringify(creatorFilter(id));

        const starred = await levelStars.getList(page, amount, {
            expand: "item,item.creator",
            sort,
            // filter: creatorFilter + featuredFilter + modFilter,
            filter,
            ...options
        });

        return starred.map((r) => r.item);
    }
);

export const getUserLevelpackStars = query(
    z.object({ ...pageSchema.shape, id: z.string() }),
    async ({ id, page, sortCode, featured, amount, mod, options }) => {
        const sort = getSort(sortCode);
        // const creatorFilter = clientPb.filter(`user = {:id} && `, { id });

        // TODO: Put in API docs: creator of the star, NOT the level/levelpack.
        // const creatorFilter = clientPb.filter(`creator = {:id}`, { id });

        // const featuredFilter = featured ? "featured = true && " : "";
        // const modFilter = clientPb.filter(`modded = {:mod}`, { mod });
        const filter = pbf.stringify(creatorFilter(id));

        const starred = await levelpackStars.getList(page, amount, {
            expand: "item,item.creator",
            sort,
            // filter: creatorFilter + featuredFilter + modFilter,
            filter,
            ...options
        });

        return starred.map((r) => r.item);
    }
);

// TODO: private func so we can use getFullList? (/server)
export const getUserAllStarredItems = query(
    z.object({ id: z.string(), type: z.number(), options: z.record(z.any(), z.any()).optional() }),
    async ({ id, type, options }) => {
        const collection = type === 0 ? levelStars : levelpackStars;
        const starred = await collection.getList(1, 9999, {
            filter: pbf.stringify(creatorFilter(id)),
            ...options
        });

        return starred.map((r) => r.item);
    }
);

function getArea(areaCode: number | undefined) {
    switch (areaCode) {
        case 0: // Any
            return null;
        case 1: // Small (18 * 32)
            return pbf.lte("area", 576);
        case 2: // Medium (32 * 32)
            return pbf.and(pbf.gt("area", 576), pbf.lte("area", 1024));
        case 3: // Large (18 * 32)
            return pbf.gt("area", 1024);
        default:
            return null;
    }
}

function getSort(sortCode: number) {
    switch (sortCode) {
        case 0:
            return "-created";
        case 1:
            return "created";
        case 2:
            return "-plays";
        case 3:
            return "-stars";
        default:
            return "";
    }
}
