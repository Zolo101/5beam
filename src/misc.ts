import { dev } from "$app/environment";

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

// export function formatDate_Full(date: Timestamp) {
//     return new Date(date._seconds * 1000).toString()
// }

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

// if i ever get a time travelling machine im going to 2013 to tell cary to use utf8 for levels 😭
export function readBlobInANSI(blob: Blob) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (event) => {
            const arrayBuffer = event.target!.result as ArrayBuffer;
            const textDecoder = new TextDecoder('windows-1252'); // ANSI
            const decodedString = textDecoder.decode(new Uint8Array(arrayBuffer));
            resolve(decodedString);
        };
        reader.onerror = (event) => {
            reject("Error reading blob: " + event.target!.error);
        };
        reader.readAsArrayBuffer(blob);
    });
}

// Cant find
export function return404() {
    return new Response(null, {status: 404})
}

// All good
export const OK = (body: any) => new Response(JSON.stringify(body), {status: 200})

// User error
export const BAD = (message: string) => new Response(message, {status: 400})

// Denied
export const DENIED = () => new Response("Authentication Denied. Have you given me a valid access_token?", {status: 401})


// export const apiURL = dev ? "http://localhost:5173" : "https://5beam.zelo.dev"
export const apiURL = dev ? "http://localhost:5173" : "https://clever-golick-4be132.netlify.app"
export const redirectURL = `${apiURL}/api/auth/callback/discord`
export const redirectURL_html5b = `${apiURL}/api/auth/callback/html5b`