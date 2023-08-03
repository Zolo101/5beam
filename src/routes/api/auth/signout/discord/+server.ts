import type { RequestHandler } from "@sveltejs/kit";
// import { importDatabase } from "../../../../../theimporter";

export const GET: RequestHandler = async ({ setHeaders, cookies }) => {
    // importDatabase()

    cookies.delete("access_token")
    cookies.delete("refresh_token")

    setHeaders({
        status: "302",
        location: "/"
    })

    return new Response("")
}