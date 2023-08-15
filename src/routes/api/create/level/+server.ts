import type { RequestHandler } from "@sveltejs/kit";
import { oauth } from "$lib/auth";
import { BAD, DENIED, OK } from "../../../../misc";
import { z } from "zod";
import { createLevel } from "../../../../talk/create";
import type { User } from "discord-oauth2";
import { toPOJO } from "../../../../talk/get";

const PostLevelSchema = z.object({
    title: z
        .string()
        .min(1)
        .max(64),
    description: z
        .string()
        .max(1024),
    modded: z
        .boolean(),
    file: z
        .string()
})

export const POST: RequestHandler = async ({cookies, request}) => {
    const json = await request.json()
    const payload = PostLevelSchema.parse(json)

    const access_token = cookies.get("access_token")
    if (access_token === undefined) return DENIED()


    // Get user from access token
    let user: User;
    try {
        user = await oauth.getUser(access_token)
    } catch (e) {
        return DENIED()
    }

    try {
        const level = await createLevel({
            creator: user,
            title: payload.title,
            description: payload.description,
            level: payload.file,
        })

        return OK(toPOJO(level))
    } catch (e) {
        return BAD("Invalid Payload")
    }
}