import { apiURL, URLParamSet } from "../misc";


export async function getLevelPageClient(page: number, amount?: number, sort?: number) {
    const url = new URL(`${apiURL}/api/page`)
    URLParamSet(url, "page", page)
    URLParamSet(url, "amount", amount)
    URLParamSet(url, "sort", sort)

    return callAPI(url)
}

export async function getLevelClient(id: string) {
    const url = new URL(`${apiURL}/api/level`)
    URLParamSet(url, "id", id)

    return callAPI(url)
}

export async function getUserClient(id: string) {
    const url = new URL(`${apiURL}/api/user`)
    URLParamSet(url, "id", id)

    return callAPI(url)
}

async function callAPI(url: URL) {
    const call = await fetch(url.toString(), {
        headers: { // Record<string, string>
            "Content-Type": "application/json"
        },
    })
    return call.json()
}