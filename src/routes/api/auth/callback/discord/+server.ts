import type { RequestHandler } from "@sveltejs/kit";
import { requestToken } from "$lib/auth";
import { redirectURL } from "../../../../../misc";

export const GET: RequestHandler = async ({request, setHeaders, cookies}) => {
    const url = new URL(request.url)
    const code = url.searchParams.get("code") ?? ""

    const tokenResponse = await requestToken(code, redirectURL)
    const accessToken = tokenResponse.access_token
    const refreshToken = tokenResponse.refresh_token

    const access_token_expires_in = new Date(Date.now() + tokenResponse.expires_in); // 10 minutes
    const refresh_token_expires_in = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days

    const headers = new Headers()

    cookies.set("access_token", accessToken, {
        path: "/",
        expires: access_token_expires_in,
        httpOnly: true,
    })

    cookies.set("refresh_token", refreshToken, {
        path: "/",
        expires: refresh_token_expires_in,
        httpOnly: true,
    })

    setHeaders({
        status: "302",
        location: "/api/auth/callback/check"
    })

    return new Response("", { headers })
}