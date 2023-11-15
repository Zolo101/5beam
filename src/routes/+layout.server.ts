import type { PageServerLoad } from "./$types";
import { refreshTokenRequest } from "$lib/auth";
import DiscordOauth2, { type User } from "$lib/DiscordOauth2";

export const load = (async ({ locals, cookies }) => {
    let user: User | undefined = locals?.user;

    if (!user) {
        // access_token is invalid, refresh it
        const refreshToken = cookies.get("refresh_token");

        if (refreshToken) {
            const result = await refreshTokenRequest(cookies, refreshToken)

            if (result) {
                user = await DiscordOauth2.getUser(result.access_token);
            }
        }
    }

    // let dbUser: PocketbaseUser | undefined = getUserById(u);

    return {user, loggedIn: !!user}
}) satisfies PageServerLoad;