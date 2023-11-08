import type { RequestHandler } from "@sveltejs/kit";
import { BAD, DENIED, OK } from "../../../../misc";
import { z } from "zod";
import { createLevel } from "../../../../talk/create";
import { toPOJO } from "../../../../talk/get";
import DiscordOauth2, { type User } from "$lib/DiscordOauth2";

const PostLevelSchema = z.object({
    title: z
        .string()
        .min(1)
        .max(64),
    description: z
        .string()
        .max(1024),
    modded: z
        .string()
        .max(64),
    file: z
        .string()
        .max(1024 * 1024 * 5) // 5 MB Limit
})

export const POST: RequestHandler = async ({cookies, request}) => {
    const json = await request.json()
    const payload = PostLevelSchema.parse(json)

    const access_token = cookies.get("access_token") ?? json.access_token
    if (access_token === undefined) return DENIED()


    // Get user from access token
    let user: User;
    try {
        user = await DiscordOauth2.getUser(access_token)
    } catch (e) {
        return DENIED()
    }

    try {
        const level = await createLevel({
            creator: user,
            title: payload.title,
            description: payload.description,
            level: payload.file,
            modded: payload.modded
        })

        return OK(toPOJO(level))
    } catch (e) {
        return BAD("Invalid Payload: " + e)
    }
}