import { URLParamSet } from "../misc";

export async function getLevelPageClient(page: number, amount?: number, sort?: number) {
    const url = new URL("http://localhost:3000/api/page")
    URLParamSet(url, "page", page)
    URLParamSet(url, "amount", amount)
    URLParamSet(url, "sort", sort)

    const call = await fetch(url.toString(), {
        headers: { // Record<string, string>
            "Content-Type": "application/json"
        },
    })
    return call.json()
}

export async function getLevelClient(id: string) {
    const call = await fetch(`http://localhost:3000/api/level?id=${id}`, {
        headers: { // Record<string, string>
            "Content-Type": "application/json"
        },
    })
    return call.json()
}

export async function getUserClient(id: string) {
    const call = await fetch(`http://localhost:3000/api/user?id=${id}`, {
        headers: { // Record<string, string>
            "Content-Type": "application/json"
        },
    })
    return call.json()
}