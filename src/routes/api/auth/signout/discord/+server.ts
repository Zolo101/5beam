import { Headers } from "node-fetch";
import type { RequestHandler } from "@sveltejs/kit";
// import { importDatabase } from "../../../../../theimporter";

// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

export const GET: RequestHandler = async () => {
    // importDatabase()

    const headers = new Headers()
    headers.append("set-cookie", `access_token=deleted; Path=/; Max-Age=-1`)
    headers.append("set-cookie", `refresh_token=deleted; Path=/; Max-Age=-1`)
    headers.set("status", "302")
    headers.set("location", "/")

    return new Response("", { headers })
}