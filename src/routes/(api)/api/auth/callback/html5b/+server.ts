import type { RequestHandler } from "@sveltejs/kit";
import { requestTokenLogIn } from "$lib/auth";
import { redirectURL_html5b } from "../../../../../../misc";

export const GET: RequestHandler = async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code") ?? "";

    const tokenResponse = await requestTokenLogIn(code, redirectURL_html5b);
    const accessToken = tokenResponse.access_token;
    const refreshToken = tokenResponse.refresh_token;

    // const access_token_expires_in = new Date(Date.now() + tokenResponse.expires_in); // 10 minutes
    // const refresh_token_expires_in = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days

    return new Response("", {
        status: 302,
        headers: {
            location: `https://coppersalts.github.io/HTML5b/authredirect?access_token=${accessToken}&refresh_token=${refreshToken}`
        }
    });
};
