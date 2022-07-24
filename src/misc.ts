import { dev } from "$app/env";
import { session } from "$app/stores";
import type { DiscordUser } from "./lib/auth";
import { get } from "svelte/store";

export const difficultyMap = new Map<number, string>([
    [0, "Unknown"],
    [1, "Easy"],
    [2, "Normal"],
    [3, "Difficult"],
    [4, "Hard"],
    [5, "Extreme"],
    [6, "Insane"],
    [7, "Impossible"],
]);

export const difficultyColorMap = new Map<number, string>([
    [0, "#808080"],
    [1, "#00ff00"],
    [2, "#ffff00"],
    [3, "#ff7700"],
    [4, "#ff0000"],
    [5, "#bc00bc"],
    [6, "#ff00ff"],
    [7, "#890000"],
]);

// TODO: Research temporal https://tc39.es/proposal-temporal/docs/index.html
export function formatDate_Day(date: string) {
    return new Date(date).toLocaleDateString("en-gb", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export function formatDate_Full(date: string) {
    return new Date(date).toString()
}

export function to5bLevelFormat(number: number) {
    return number.toString().padStart(3, "0")
}

// Only sets if the param isn't undefined
export function URLParamSet(url: URL, prop: string, param: number | string | undefined) {
    if (param !== undefined) {
        url.searchParams.set(prop, param.toString())
    }
}

export function isLoggedIn() {
    const user: (DiscordUser | false) = get<any>(session).user
    return (user !== false)
}

export const apiURL = dev ? "http://localhost:3000" : "https://5beam.zelo.dev"
export const redirectURL = `${apiURL}/api/auth/callback/discord`
export const redirectURL_html5b = `${apiURL}/api/auth/callback/html5b`