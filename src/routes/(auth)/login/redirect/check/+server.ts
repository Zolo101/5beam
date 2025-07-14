import type { RequestHandler } from "@sveltejs/kit";
// import { createUser } from "../../../../../talk/create";

// TODO: Another redirect :( Necessary?
export const GET: RequestHandler = async ({ request }) => {
    // Checks if the user exists in the database, and if not, creates them
    // await checkUser(request)

    return new Response("", {
        status: 302,
        headers: {
            location: "/"
        }
    });
};
