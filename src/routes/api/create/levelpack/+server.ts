import type { RequestHandler } from "@sveltejs/kit";
import { toPOJO } from "../../../../talk/get";
import { BAD, DENIED, OK } from "../../../../misc";
import type { User } from "discord-oauth2";
import { oauth } from "$lib/auth";
import { createLevelpack } from "../../../../talk/create";
import { z } from "zod";

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
})


export const POST: RequestHandler = async ({cookies, request}) => {
    const json = await request.json()
    const payload = PostLevelSchema.parse(json)

    const access_token = cookies.get("access_token") ?? json.access_token
    if (access_token === undefined) return DENIED()


    // Get user from access token
    let user: User;
    try {
        user = await oauth.getUser(access_token)
    } catch (e) {
        return DENIED()
    }

    try {
        const levelpack = await createLevelpack({
            creator: user,
            title: payload.title,
            description: payload.description,
            level: payload.file,
            modded: payload.modded
        })

        return OK(toPOJO(levelpack))
    } catch (e) {
        console.error(e)
        return BAD("Invalid Payload: " + e)
    }
}