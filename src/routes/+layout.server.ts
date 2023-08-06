import type { PageServerLoad } from "./$types";
import type { User } from "discord-oauth2";
import { oauth, refreshTokenRequest, setAccessToken, setRefreshToken } from "$lib/auth";

export const load = (async ({ locals, cookies }) => {
    let user: User | undefined = locals.user;


    if (!user) {
        // access_token is invalid, refresh it
        const refreshToken = cookies.get("refresh_token");
        const result = await refreshTokenRequest(cookies, refreshToken)

        if (result) {
            setAccessToken(cookies, result.access_token, result.expires_in)
            setRefreshToken(cookies, result.refresh_token)
            user = await oauth.getUser(result.access_token);
        }
    }

    // let dbUser: PocketbaseUser | undefined = getUserById(u);

    return {user, loggedIn: !!user}
}) satisfies PageServerLoad;