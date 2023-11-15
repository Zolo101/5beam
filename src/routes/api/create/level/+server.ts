import type { RequestHandler } from "@sveltejs/kit";
import { BAD, DENIED, OK, PostLevelSchema } from "../../../../misc";
import { createLevel } from "../../../../talk/create";
import { toPOJO } from "../../../../talk/get";
import DiscordOauth2, { type User } from "$lib/DiscordOauth2";
import { refreshTokenRequest } from "$lib/auth";

export const POST: RequestHandler = async ({cookies, request}) => {
    const json = await request.json()
    const payload = PostLevelSchema.parse(json)

    const access_token = cookies.get("access_token") ?? json.access_token
    const refresh_token = cookies.get("refresh_token") ?? json.refresh_token

    // Get user from access token
    let user: User;
    try {
        user = await DiscordOauth2.getUser(access_token)
    } catch (e) {
        // Refresh token and try again
        if (refresh_token) {
            let result = await refreshTokenRequest(cookies, refresh_token)

            if (result) {
                user = await DiscordOauth2.getUser(result.access_token)
            } else {
                return DENIED()
            }
        } else {
            return DENIED()
        }
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