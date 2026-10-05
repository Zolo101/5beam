import { describe, expect, it } from "vitest";
import { getHtml5bClient, html5bAuthRedirects } from "$lib/server/html5bAuth";

describe("HTML5b login return site", () => {
    it("recognizes the fork from its referrer", () => {
        expect(getHtml5bClient(undefined, "https://tylerosc.github.io/HTML5bComplete/")).toBe(
            "tylerosc"
        );
        expect(html5bAuthRedirects.tylerosc).toBe(
            "https://tylerosc.github.io/HTML5bComplete/authredirect"
        );
    });

    it("uses an explicit client when the referrer is missing", () => {
        expect(getHtml5bClient("tylerosc", null)).toBe("tylerosc");
    });

    it("keeps unknown and missing referrers on the original game", () => {
        expect(getHtml5bClient(undefined, "https://tylerosc.github.io.evil.example/")).toBe(
            "coppersalts"
        );
        expect(getHtml5bClient(undefined, null)).toBe("coppersalts");
    });
});
