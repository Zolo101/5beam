import type { RequestHandler } from "@sveltejs/kit";
import { refreshTokenRequest } from "$lib/auth";
import { BAD, OK } from "../../../../misc";

export const POST: RequestHandler = async ({request, cookies}) => {
    const json = await request.json()
    const refresh_token = json.refresh_token ?? ""
    if (refresh_token === "") return BAD("Empty refresh token!")

    const tokenResponse = await refreshTokenRequest(cookies, refresh_token)
    if (tokenResponse) {
        // setAccessToken(cookies, tokenResponse.access_token, tokenResponse.expires_in)
        // setRefreshToken(cookies, tokenResponse.refresh_token)
        return OK(tokenResponse)
    } else {
        return BAD("Invalid refresh token, you'll have to log in again.")
    }
}