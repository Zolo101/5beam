import { functionsApiURL } from "$lib/misc";
import validate from "$lib/client/FileValidator";

export function isLevelValid(level: string) {
    return validate(level).valid;
}

export function isLevelpackValid(levels: string[]) {
    return levels.every((level) => validate(level).valid);
}

export function generateThumbnail(level: string) {
    return fetch(`${functionsApiURL}/createThumbnail`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: level
    });
}
