import { Headers } from "node-fetch";
import type { RequestHandler } from "@sveltejs/kit";
import { requestToken } from "../../../../../lib/auth";
import { redirectURL } from "../../../../../misc";

export const GET: RequestHandler = async ({request}) => {
    const url = new URL(request.url)
    const code = url.searchParams.get("code") ?? ""

    const tokenResponse = await requestToken(code, redirectURL)
    const accessToken = tokenResponse.access_token
    const refreshToken = tokenResponse.refresh_token

    const access_token_expires_in = new Date(Date.now() + tokenResponse.expires_in); // 10 minutes
    const refresh_token_expires_in = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days

    const headers = new Headers()
    headers.append("set-cookie", `access_token=${accessToken}; Path=/; Max-Age=${access_token_expires_in}; HttpOnly`)
    headers.append("set-cookie", `refresh_token=${refreshToken}; Path=/; Max-Age=${refresh_token_expires_in}; HttpOnly`)
    headers.set("status", "302")
    headers.set("location", "/api/auth/callback/check")

    return new Response("", { headers })
}