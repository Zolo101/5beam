import { dev } from "$app/environment";
import type { Timestamp } from "firebase/firestore";

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

export function formatDate_Full(date: Timestamp) {
    return new Date(date._seconds * 1000).toString()
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
    // const user: (DiscordUser | false) = get<any>(page.data.user).user
    // return (user !== false)
    return false
}

export function return404() {
    return new Response(null, {status: 404})
}

export const mergeObjects = <A, B>(a: A, b: B): A & B => {
    return {...a, ...b}
}


export const apiURL = dev ? "http://localhost:5173" : "https://5beam.zelo.dev"
export const redirectURL = `${apiURL}/api/auth/callback/discord`
export const redirectURL_html5b = `${apiURL}/api/auth/callback/html5b`