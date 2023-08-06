import type { RequestHandler } from "@sveltejs/kit";
import { refreshTokenRequest, setAccessToken, setRefreshToken } from "$lib/auth";
import { BAD, OK } from "../../../../misc";

export const GET: RequestHandler = async ({request, cookies}) => {
    const url = new URL(request.url)
    const refresh_token = url.searchParams.get("refresh_token") ?? ""

    const tokenResponse = await refreshTokenRequest(cookies, refresh_token)
    if (tokenResponse) {
        setAccessToken(cookies, tokenResponse.access_token, tokenResponse.expires_in)
        setRefreshToken(cookies, tokenResponse.refresh_token)
        return OK(tokenResponse.refresh_token)
    } else {
        return BAD("Invalid refresh token, you'll have to log in again.")
    }
}