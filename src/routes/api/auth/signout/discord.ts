import type { RequestHandler } from "@sveltejs/kit";

export const get: RequestHandler = async () => {
    return {
        status: 302,
        headers: {
            "set-cookie": [
                `access_token=deleted; Path=/; Max-Age=-1`,
                `refresh_token=deleted; Path=/; Max-Age=-1`,
            ],
            location: "/"
        }
    }
}