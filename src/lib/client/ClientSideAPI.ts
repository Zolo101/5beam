import { apiURL, URLParamSet } from "$lib/misc";
import type { PocketbaseUser } from "$lib/types";

export async function postModifyLevelClient(payload: Record<string, unknown>, id: string) {
    const url = new URL(`${apiURL}/api/modify/level`);
    URLParamSet(url, "id", id);
    const call = await fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return call.json();
}

export async function postModifyLevelpackClient(payload: Record<string, unknown>, id: string) {
    const url = new URL(`${apiURL}/api/modify/levelpack`);
    URLParamSet(url, "id", id);
    const call = await fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return call.json();
}

export async function postCreateLevelClient(payload: Record<string, unknown>) {
    const url = new URL(`${apiURL}/api/create/level`);
    const call = await fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return call.json();
}

export async function postCreateLevelpackClient(payload: Record<string, unknown>) {
    const url = new URL(`${apiURL}/api/create/levelpack`);
    const call = await fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify(payload)
    });
    return call.json();
}

export async function getLevelPageClient(
    page: number,
    type?: number,
    sort?: number,
    featured?: boolean,
    amount?: number,
    mod?: string
) {
    const url = new URL(`${apiURL}/api/page`);
    URLParamSet(url, "page", page);
    URLParamSet(url, "type", type);
    URLParamSet(url, "sort", sort);
    URLParamSet(url, "featured", featured);
    URLParamSet(url, "amount", amount);
    URLParamSet(url, "mod", mod);
    return callAPI(url);
}

export async function getTrendingLevelPageClient(page: number, amount?: number) {
    const url = new URL(`${apiURL}/api/page/trending`);
    URLParamSet(url, "page", page);
    URLParamSet(url, "amount", amount);
    return callAPI(url);
}

export async function getRandomLevelPageClient(
    amount: number,
    type?: number,
    featured?: boolean,
    mod?: string
) {
    const url = new URL(`${apiURL}/api/page/random`);
    URLParamSet(url, "amount", amount);
    URLParamSet(url, "type", type);
    URLParamSet(url, "featured", featured);
    URLParamSet(url, "mod", mod);

    return callAPI(url);
}

export async function getLevelClient(id: string) {
    const url = new URL(`${apiURL}/api/level`);
    URLParamSet(url, "id", id);

    return callAPI(url);
}

export async function getLevelpackClient(id: string, levels: number) {
    const url = new URL(`${apiURL}/api/levelpack`);
    URLParamSet(url, "id", id);
    URLParamSet(url, "levels", levels);

    return callAPI(url);
}

export async function getSearchClient(text: string, amount?: number, mod?: string) {
    const url = new URL(`${apiURL}/api/search`);
    URLParamSet(url, "text", text);
    URLParamSet(url, "amount", amount);
    URLParamSet(url, "mod", mod);

    return callAPI(url);
}

export async function getUserByIdClient(id: string): Promise<PocketbaseUser> {
    const url = new URL(`${apiURL}/api/user`);
    URLParamSet(url, "id", id);

    return callAPI(url);
}

export async function getUserByDiscordIdClient(discordId: number) {
    const url = new URL(`${apiURL}/api/user`);
    URLParamSet(url, "discordId", discordId);

    return callAPI(url);
}

export async function getUserLevelPageClient(
    id: string,
    page: number,
    type?: number,
    sort?: number,
    featured?: boolean,
    amount?: number,
    mod?: string
) {
    const url = new URL(`${apiURL}/api/user/page`);
    URLParamSet(url, "id", id);
    URLParamSet(url, "page", page);
    URLParamSet(url, "type", type);
    URLParamSet(url, "sort", sort);
    URLParamSet(url, "featured", featured);
    URLParamSet(url, "amount", amount);
    URLParamSet(url, "mod", mod);

    return callAPI(url);
}

async function callAPI(url: URL) {
    const call = await fetch(url.toString(), {
        method: "GET"
    });
    return call.json();
}
