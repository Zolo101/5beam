import type { LayoutServerLoad } from "../../../.svelte-kit/types/src/routes";
import { refreshTokenRequest } from "$lib/auth";
import DiscordOauth2, { type User } from "$lib/DiscordOauth2";
import { isAdmin, isLoggedIn } from "../../misc";

export const load = (async ({ locals, cookies }) => {
    let user: User | undefined = locals?.user;

    if (!user) {
        // access_token is invalid, refresh it
        const refreshToken = cookies.get("refresh_token");

        if (refreshToken) {
            const result = await refreshTokenRequest(cookies, refreshToken);

            if (result) {
                user = await DiscordOauth2.getUser(result.access_token);
            }
        }
    }

    let admin = isAdmin(user);
    let loggedIn = isLoggedIn(user);

    return { user, admin, loggedIn };
}) satisfies LayoutServerLoad;
