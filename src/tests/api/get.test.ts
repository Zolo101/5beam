import { apiURL } from "$lib/misc";
import { LevelpackSchema, LevelSchema, UserSchema } from "$lib/types";
import { describe, it, expect } from "vitest";
import type z from "zod";

function itemTest(route: string) {
    describe(`page /${route}`, () => {
        it(`return 200`, async () => {
            const res = await fetch(`${apiURL}/${route}`);

            expect(res.status).toBe(200);
        });
    });
}

function itemSiteTests(item: string, testId: string) {
    describe(`page /${item}`, () => {
        it(`return 200 with the correct id`, async () => {
            const res = await fetch(`${apiURL}/${item}/${testId}`);

            expect(res.status).toBe(200);
        });

        it(`return 404 for a non-existent ${item} id`, async () => {
            const res = await fetch(`${apiURL}/${item}/doesnotexist`);

            expect(res.status).toBe(404);
        });

        // it(`return 404 when no ${item} id is provided`, async () => {
        //     const res = await fetch(`${apiURL}/${item}`);

        //     expect(res.status).toBe(404);
        // });
    });
}

function itemAPITests(item: string, testId: string, schema: z.ZodType) {
    describe(`GET /api/${item}`, () => {
        it(`return a valid ${item}`, async () => {
            const res = await fetch(`${apiURL}/api/${item}?id=${testId}`);

            expect(res.status).toBe(200);

            const resItem = await res.json();
            expect(resItem).toStrictEqual(expect.schemaMatching(schema));
        });

        it(`return a ${item} with the correct id`, async () => {
            const res = await fetch(`${apiURL}/api/${item}?id=${testId}`);

            expect(res.status).toBe(200);

            const resItem = await res.json();
            expect(resItem.id).toBe(testId);
        });

        it(`return 404 for a non-existent ${item} id`, async () => {
            const res = await fetch(`${apiURL}/api/${item}?id=doesnotexist`);

            expect(res.status).toBe(404);
        });

        it(`return 400 when no ${item} id is provided`, async () => {
            const res = await fetch(`${apiURL}/api/${item}`);

            expect(res.status).toBe(400);
        });
    });
}

function pageAPITests(endpoint: string, initialParams?: string) {
    describe(`GET /api/${endpoint}`, () => {
        it(`return a list of valid levels with defaults`, async () => {
            const res = await fetch(
                `${apiURL}/api/${endpoint}${initialParams ? `?${initialParams}` : "?"}`
            );
            expect(res.status).toBe(200);

            const resItems = await res.json();
            expect(resItems).toStrictEqual(expect.schemaMatching(LevelSchema.array()));
        });

        it(`return a list of levels using type = 0`, async () => {
            const res = await fetch(
                `${apiURL}/api/${endpoint}${initialParams ? `?${initialParams}&` : "?"}page=1&type=0`
            );
            expect(res.status).toBe(200);

            const resItems = await res.json();
            expect(resItems).toStrictEqual(expect.schemaMatching(LevelSchema.array()));
        });

        it(`return a list of levelpacks using type = 1`, async () => {
            const res = await fetch(
                `${apiURL}/api/${endpoint}${initialParams ? `?${initialParams}&` : "?"}page=1&type=1`
            );
            expect(res.status).toBe(200);

            const resItems = await res.json();
            expect(resItems).toStrictEqual(expect.schemaMatching(LevelpackSchema.array()));
        });
    });
}

describe("Site", () => {
    itemSiteTests("level", "clhfolf9eg00opt");
    itemSiteTests("levelpack", "a1x6jhja651v735");
    itemSiteTests("user", "y2fhbwb4vbpg6lm");
    itemTest("api");
    itemTest("discover");
    itemTest("mods");
    itemTest("random");
    // itemTest("sitemap.xml");

    // TODO: Test auth routes
    // itemTest("stars");
    // itemTest("upload");
    // itemTest("profile");
    // itemTest("user");
});

describe("API", () => {
    describe("GET", () => {
        itemAPITests("level", "clhfolf9eg00opt", LevelSchema);
        itemAPITests("levelpack", "a1x6jhja651v735", LevelpackSchema);
        itemAPITests("user", "y2fhbwb4vbpg6lm", UserSchema);
        pageAPITests("search", "text=Hello");
        pageAPITests("page");
        pageAPITests("user/page", "id=m44nvxs3tjoqor0");
        pageAPITests("user/stars/page", "id=m44nvxs3tjoqor0");
        pageAPITests("page/random");
        pageAPITests("page/trending");
    });
});
