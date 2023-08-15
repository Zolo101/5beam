import type { RequestHandler } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ setHeaders, cookies }) => {

    cookies.delete("access_token")
    cookies.delete("refresh_token")

    throw redirect(308, "/")
}