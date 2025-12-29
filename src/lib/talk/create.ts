import { functionsApiURL } from "$lib/misc";
import validate from "$lib/client/FileValidator";

export function isLevelValid(level: string) {
    return validate(level).valid;
}

export function isLevelpackValid(levels: string[]) {
    return levels.every((level) => validate(level).valid);
}

export function generateThumbnail(level: string, x = 0, y = 0) {
    return fetch(`${functionsApiURL}/createThumbnail?x=${x}&y=${y}`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: level
    });
}

export function generateThumbnailFull(level: string) {
    // TODO: x=0&y=0 shouldn't be required parameters (it brakes otherwise)
    return fetch(`${functionsApiURL}/createThumbnail?full=true&x=0&y=0`, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: level
    });
}
