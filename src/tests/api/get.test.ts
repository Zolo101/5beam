import { apiURL } from "$lib/misc";
import { LevelpackSchema, LevelSchema, UserSchema } from "$lib/types";
import { describe, it, expect } from "vitest";
import type z from "zod";

function itemTests(item: string, testId: string, schema: z.ZodType) {
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

function pageTests(endpoint: string, initialParams?: string) {
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

describe("GET", () => {
    itemTests("level", "clhfolf9eg00opt", LevelSchema);
    itemTests("levelpack", "a1x6jhja651v735", LevelpackSchema);
    itemTests("user", "y2fhbwb4vbpg6lm", UserSchema);
    pageTests("search", "text=Hello");
    pageTests("page");
    pageTests("user/page", "id=m44nvxs3tjoqor0");
    pageTests("user/stars/page", "id=m44nvxs3tjoqor0");
    pageTests("page/random");
    pageTests("page/trending");
});
