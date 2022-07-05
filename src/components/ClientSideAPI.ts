export async function getLevelPageClient(page: number) {
    const call = await fetch(`http://localhost:3000/api/page?page=${page}`, {
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