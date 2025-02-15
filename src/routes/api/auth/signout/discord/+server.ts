import type { RequestHandler } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ cookies }) => {
    cookies.delete("access_token", { path: "/" });
    cookies.delete("refresh_token", { path: "/" });

    throw redirect(308, "/");
};
