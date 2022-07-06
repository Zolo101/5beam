import { dev } from "$app/env";

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


// Only sets if the param isn't undefined
export function URLParamSet(url: URL, prop: string, param: number | string | undefined) {
    if (param !== undefined) {
        url.searchParams.set(prop, param.toString())
    }
}

export const apiURL = dev ? "https://localhost:3000" : "https://5beam.zelo.dev"
export const redirectURL = `${apiURL}/api/auth/callback/discord`