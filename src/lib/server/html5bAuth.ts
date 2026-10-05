export const html5bAuthRedirects = {
    coppersalts: "https://coppersalts.github.io/HTML5b/authredirect",
    tylerosc: "https://tylerosc.github.io/HTML5bComplete/authredirect"
} as const;

export type Html5bClient = keyof typeof html5bAuthRedirects;

export function getHtml5bClient(
    client: Html5bClient | undefined,
    referrer: string | null
): Html5bClient {
    if (client) return client;

    try {
        const origin = new URL(referrer ?? "").origin;
        if (origin === "https://tylerosc.github.io") return "tylerosc";
    } catch {
        // Requests without a referrer use the original game.
    }

    return "coppersalts";
}
