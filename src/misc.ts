import * as Diff from "diff";
import { dev } from "$app/environment";
import { z } from "zod";
import type { User } from "$lib/DiscordOauth2";

export const difficultyMap = new Map<number, string>([
    [0, "Unknown"],
    [1, "Easy"],
    [2, "Normal"],
    [3, "Difficult"],
    [4, "Hard"],
    [5, "Extreme"],
    [6, "Insane"],
    [7, "Impossible"]
]);

export const difficultyColorMap = new Map<number, string>([
    [0, "#808080"],
    [1, "#00ff00"],
    [2, "#ffff00"],
    [3, "#ff7700"],
    [4, "#ff0000"],
    [5, "#bc00bc"],
    [6, "#ff00ff"],
    [7, "#890000"]
]);

export const Icons = import.meta.glob("$lib/assets/icons/*.svg", { eager: true, as: "raw" });
export const Sprites = import.meta.glob("$lib/assets/sprites/*.svg", { eager: true, as: "raw" });
export const difficultyImages = import.meta.glob("$lib/assets/difficulty/*.png", {
    eager: true,
    as: "url"
});
export const backgrounds = import.meta.glob("$lib/assets/backgrounds/*.png", {
    eager: true,
    as: "url"
});

// TODO: Research temporal https://tc39.es/proposal-temporal/docs/index.html
export function formatDate_Day(date: string) {
    return new Date(date).toLocaleDateString("en-gb", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

export function sample<T>(array: T[], amount: number) {
    if (amount > array.length) throw new Error("Amount is greater than array length.");

    const result = [];
    for (let i = 0; i < amount; i++) {
        const index = ~~(Math.random() * array.length);
        result.push(array[index]);
        array.splice(index, 1);
    }
    return result;
}

// export function formatDate_Full(date: Timestamp) {
//     return new Date(date._seconds * 1000).toString()
// }

export function to5bLevelFormat(number: number) {
    return number.toString().padStart(3, "0");
}

// Only sets if the param isn't undefined
export function URLParamSet(url: URL, prop: string, param: number | string | undefined) {
    if (param !== undefined) {
        url.searchParams.set(prop, param.toString());
    }
}

export function getLevelThumbnailURL(id: string, filename: string, mini: boolean = false) {
    return filename
        ? `https://cdn.zelo.dev/api/files/vrxyo8zslj53wuy/${id}/${filename}${mini ? "?thumb=335x184" : ""}`
        : fallbackThumbnailURL;
}

// if i ever get a time travelling machine im going to 2013 to tell cary to use utf8 for levels 😭
export function readBlobInANSI(blob: Blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target!.result as ArrayBuffer;
            const textDecoder = new TextDecoder("windows-1252"); // ANSI
            const decodedString = textDecoder.decode(new Uint8Array(arrayBuffer));
            resolve(decodedString);
        };
        reader.onerror = (event) => {
            reject("Error reading blob: " + event.target!.error);
        };
        reader.readAsArrayBuffer(blob);
    });
}

const prefixes = ["", "K", "M", "B", "T"];
export const getPlaysString = (plays: number) => {
    let prefixIndex = 0;

    while (plays > 1000) {
        plays = plays / 1000;
        prefixIndex++;
    }

    // only show 2 decimal places if we're using a prefix
    return `${plays.toFixed(prefixIndex ? 2 : 0)}${prefixes[prefixIndex]}`;
};

export const PostLevelSchema = z.object({
    title: z.string().min(1).max(64),
    description: z.string().max(1024),
    difficulty: z.number().int().min(0).max(7).optional(), // TODO: Remove when you can select difficulties for levels and levelpacks in /upload
    modded: z.string().max(64),
    file: z.string().max(1024 * 1024 * 5) // 5 MB Limit
});

export function generateDiff(oldText: string, newText: string) {
    const diffs = Diff.diffLines(oldText, newText, { newlineIsToken: true });
    let result = "";
    for (const change of diffs) {
        const color = change.added ? "green" : change.removed ? "red" : "grey";

        switch (color) {
            case "green":
                result += `+ ${change.value}`;
                break;
            case "red":
                result += `- ${change.value}`;
                break;
            default:
                result += change.value;
                break;
        }

        result += "\n";
    }

    return result;
}

export const isLoggedIn = (user: User | undefined) => !!user;

// checks are done server-side as well
export const isAdmin = (user: User | undefined) => user?.id === "189004032600309760";

// Cant find
export function NOT_FOUND() {
    return new Response(null, { status: 404 });
}
// All good
export const OK = (body?: any) => new Response(JSON.stringify(body), { status: 200 });

// User error
export const BAD = (message: string) => new Response(message, { status: 400 });

// Server error
export const MY_BAD = (message: string) => new Response(message, { status: 500 });

// Denied
export const DENIED = () =>
    new Response("Authentication Denied. Have you given me a valid access_token?", { status: 401 });

export const apiURL = dev ? "http://localhost:5173" : "https://5beam.zelo.dev";
// export const apiURL = !dev ? "http://localhost:4173" : "https://5beam.zelo.dev"
// TODO: Create new subdomain for lambda functions?
export const functionsApiURL = "https://44u9xta0sk.execute-api.eu-west-2.amazonaws.com/default";
export const redirectURL = `${apiURL}/api/auth/callback/discord`;
export const redirectURL_html5b = `${apiURL}/api/auth/callback/html5b`;
export const fallbackThumbnailURL = `${apiURL}/placeholder.png`;
