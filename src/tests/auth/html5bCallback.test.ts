import { describe, expect, it, vi } from "vitest";
import { redirectURL_html5b } from "$lib/misc";
import { GET } from "../../routes/(auth)/login/callback/html5b/+server";

describe("HTML5b OAuth callback", () => {
    async function callback(client?: string) {
        const deleted: string[] = [];
        const authWithOAuth2Code = vi.fn().mockResolvedValue({
            record: { id: "user-id" },
            token: "test-token"
        });
        const response = await GET({
            url: new URL("https://5beam.zelo.dev/login/callback/html5b?code=test-code"),
            cookies: {
                get: (name: string) =>
                    name === "discord_code_verifier"
                        ? "test-verifier"
                        : name === "html5b_auth_client"
                          ? client
                          : undefined,
                delete: (name: string) => deleted.push(name)
            },
            locals: {
                pb: { collection: () => ({ authWithOAuth2Code }) }
            }
        } as unknown as Parameters<typeof GET>[0]);

        return { response, deleted, authWithOAuth2Code };
    }

    it("returns the token to the fork selected before Discord login", async () => {
        const { response, deleted, authWithOAuth2Code } = await callback("tylerosc");
        const location = new URL(response.headers.get("location")!);

        expect(response.status).toBe(302);
        expect(location.origin + location.pathname).toBe(
            "https://tylerosc.github.io/HTML5bComplete/authredirect"
        );
        expect(JSON.parse(location.searchParams.get("5beam_auth")!)).toEqual({
            record: { id: "user-id" },
            token: "test-token"
        });
        expect(deleted).toContain("html5b_auth_client");
        expect(authWithOAuth2Code).toHaveBeenCalledWith(
            "discord",
            "test-code",
            "test-verifier",
            redirectURL_html5b
        );
    });

    it("defaults to the original game when no client was stored", async () => {
        const { response } = await callback();
        expect(response.headers.get("location")).toMatch(
            /^https:\/\/coppersalts\.github\.io\/HTML5b\/authredirect\?/
        );
    });
});
