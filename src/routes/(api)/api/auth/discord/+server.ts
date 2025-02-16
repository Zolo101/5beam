import type { RequestHandler } from "@sveltejs/kit";
import { redirectURL } from "../../../../../misc";

export const GET: RequestHandler = async () => {
    return new Response("", {
        status: 302,
        headers: {
            location: `https://canary.discord.com/api/oauth2/authorize?client_id=${import.meta.env.VITE_AUTH_CLIENT_ID}&redirect_uri=${redirectURL}&response_type=code&scope=identify`
        }
    });
};
