import type { RequestHandler } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { requestTokenLogIn, setAccessToken, setRefreshToken } from "$lib/auth";
import { redirectURL } from "../../../../../misc";

export const GET: RequestHandler = async ({request, cookies}) => {
    const url = new URL(request.url)
    const code = url.searchParams.get("code") ?? ""

    const tokenResponse = await requestTokenLogIn(code, redirectURL)
    setAccessToken(cookies, tokenResponse.access_token, tokenResponse.expires_in)
    setRefreshToken(cookies, tokenResponse.refresh_token)

    throw redirect(308, "/api/auth/callback/check")
}