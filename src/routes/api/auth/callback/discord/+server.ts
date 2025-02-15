import type { RequestHandler } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";
import { requestTokenLogIn, setAccessToken, setRefreshToken } from "$lib/auth";
import { BAD, redirectURL } from "../../../../../misc";
import { getUserByDiscordId, updateFetch } from "../../../../../talk/get";
import DiscordOauth2 from "$lib/DiscordOauth2";
import { users } from "$lib/pocketbase";

export const GET: RequestHandler = async ({ request, cookies }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code") ?? "";

    const tokenResponse = await requestTokenLogIn(code, redirectURL);
    if ("error" in tokenResponse) return BAD(tokenResponse.error);

    setAccessToken(cookies, tokenResponse.access_token, tokenResponse.expires_in);
    setRefreshToken(cookies, tokenResponse.refresh_token);

    const user = await DiscordOauth2.getUser(tokenResponse.access_token);
    // console.log(user)

    getUserByDiscordId(user.id)
        .then((pbUser) => {
            // Change username if they've updated it on discord
            if (user.username !== pbUser.username) {
                updateFetch(users, pbUser.id, { username: user.username });
            }
        })
        .catch(async () => {
            console.log("Creating user");
            // Have to use fetch because pocketbase doesn't have SDK header support
            // https://github.com/pocketbase/pocketbase/discussions/2618
            await fetch("https://cdn.zelo.dev/api/collections/5beam_users_discord/records", {
                method: "POST",
                headers: {
                    // TODO: In the future, find a better way to auth this
                    "Content-Type": "application/json",
                    secret: import.meta.env.VITE_POCKETBASE_USER_SECRET
                },
                body: JSON.stringify({
                    discordId: user.id,
                    username: user.username
                })
            });
        });

    throw redirect(308, "/api/auth/callback/check");
};
