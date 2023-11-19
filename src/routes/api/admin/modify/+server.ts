import type { RequestHandler } from "@sveltejs/kit";
import { BAD, DENIED, isAdmin, OK, return404 } from "../../../../misc";
import { toPOJO, updateFetch } from "../../../../talk/get";
import { tryGettingUser } from "../../../../talk/admin";
import { levels } from "$lib/pocketbase";
import type { Level } from "$lib/types";
import { ChangeDescriptionWebhook, ChangeDifficultyWebhook, ChangeTitleWebhook } from "$lib/webhook";

export const POST: RequestHandler = async ({cookies, request, fetch}) => {
    const url = new URL(request.url)

    const id = url.searchParams.get("id")
    const title = url.searchParams.get("title")
    const description = url.searchParams.get("description")
    const difficulty = url.searchParams.get("difficulty")

    if (id === null) return return404() // Not Found

    const access_token = cookies.get("access_token")
    const refresh_token = cookies.get("refresh_token")
    if (!access_token || !refresh_token) return DENIED()

    // Get user from access token
    const user = await tryGettingUser(access_token, refresh_token, cookies)
    if (!user) return DENIED()

    try {
        const level = await levels.getOne<Level>(id)
        const allowed = user.id === level.creator.id || isAdmin(user)
        if (allowed) {
            let parsedDifficulty: number | null = Number(difficulty)
            if (difficulty === null) parsedDifficulty = null;

            let body: Record<string, unknown> = {}
            if (title) body["title"] = title
            if (description) body["description"] = description
            if (parsedDifficulty !== null) body["difficulty"] = parsedDifficulty

            const newLevel = await updateFetch<Level>(levels, id, body)

            if (title) await ChangeTitleWebhook.send(title, level)
            if (description) await ChangeDescriptionWebhook.send(description, level)
            if (parsedDifficulty !== null) await ChangeDifficultyWebhook.send(parsedDifficulty, level)

            return OK(toPOJO(newLevel))
        } else {
            return DENIED()
        }
    } catch (e) {
        return BAD("Invalid Payload: " + e)
    }
}