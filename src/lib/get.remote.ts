import { query } from "$app/server";
import z from "zod";
import { clientPb, dailyies, levelpacks, levels } from "./clientPocketbase";

const pageSchema = z.object({
    page: z.number().min(1),
    sortCode: z.number().min(0).max(3),
    featured: z.boolean(),
    mod: z.string(),
    amount: z.number(),
    options: z.record(z.any(), z.any()).optional()
});

export const getDaily = query(async () => {
    const daily = await dailyies.getList(1, 1, {
        filter: "featured = false",
        expand: "level,level.creator"
    });

    return daily;
});

export const getLevels = query(
    pageSchema,
    async ({ page, sortCode, featured, mod, amount, options }) => {
        const sort = getSort(sortCode);
        const featuredFilter = featured ? "featured = true && " : "";
        const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

        return await levels.getList(page, amount, {
            expand: "creator",
            sort,
            filter: featuredFilter + modFilter,
            ...options
        });
    }
);

export const getLevelpacks = query(
    pageSchema,
    async ({ page, sortCode, featured, mod, amount, options }) => {
        const sort = getSort(sortCode);
        const featuredFilter = featured ? "featured = true && " : "";
        const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

        return await levelpacks.getList(page, amount, {
            expand: "creator",
            sort,
            filter: featuredFilter + modFilter,
            ...options
        });
    }
);

export const getTrendingLevels = query(pageSchema, async ({ page, amount, mod, options }) => {
    const modFilter = clientPb.filter(`modded = {:mod}`, { mod });
    const range = 1000 * 60 * 60 * 24 * 14; // 2 weeks
    const date = new Date(Date.now() - range).toISOString().replace("T", " ").substring(0, 19);
    const filter = clientPb.filter(modFilter + " && created >= {:date}", { date });

    return await levels.getList(page, amount, {
        expand: "creator",
        sort: "-plays",
        filter,
        ...options
    });
});

export const getLevelSearch = query(
    z.object({ ...pageSchema.shape, text: z.string() }),
    async ({ text, page, sortCode, featured, mod, amount, options }) => {
        const sort = getSort(sortCode);
        const featuredFilter = featured ? "featured = true && " : "";
        const modFilter = clientPb.filter(`modded = {:mod} &&`, { mod });
        const textFilter = clientPb.filter(`title ~ {:text}`, { text });

        return await levels.getList(page, amount, {
            expand: "creator",
            sort,
            filter: featuredFilter + modFilter + textFilter,
            ...options
        });
    }
);

export const getLevelpackSearch = query(
    z.object({ ...pageSchema.shape, text: z.string() }),
    async ({ text, page, sortCode, featured, mod, amount, options }) => {
        const sort = getSort(sortCode);
        const featuredFilter = featured ? "featured = true && " : "";
        const modFilter = clientPb.filter(`modded = {:mod} &&`, { mod });
        const textFilter = clientPb.filter(`title ~ {:text}`, { text });

        return await levelpacks.getList(page, amount, {
            expand: "creator",
            sort,
            filter: featuredFilter + modFilter + textFilter,
            ...options
        });
    }
);

export const getUserLevels = query(
    z.object({ ...pageSchema.shape, id: z.string() }),
    async ({ id, page, sortCode, featured, amount, mod, options }) => {
        const sort = getSort(sortCode);
        const creatorFilter = clientPb.filter(`creator = {:id} && `, { id });
        const featuredFilter = featured ? "featured = true && " : "";
        const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

        return await levels.getList(page, amount, {
            expand: "creator",
            sort,
            filter: creatorFilter + featuredFilter + modFilter,
            ...options
        });
    }
);

export const getUserLevelpacks = query(
    z.object({ ...pageSchema.shape, id: z.string() }),
    async ({ id, page, sortCode, featured, amount, mod, options }) => {
        const sort = getSort(sortCode);
        const creatorFilter = clientPb.filter(`creator = {:id} && `, { id });
        const featuredFilter = featured ? "featured = true && " : "";
        const modFilter = clientPb.filter(`modded = {:mod}`, { mod });

        return await levelpacks.getList(page, amount, {
            expand: "creator",
            sort,
            filter: creatorFilter + featuredFilter + modFilter,
            ...options
        });
    }
);

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
