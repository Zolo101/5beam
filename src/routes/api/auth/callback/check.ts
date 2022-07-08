import type { RequestHandler } from "@sveltejs/kit";
import { createUser, getUserByDiscordId } from "../../../../talk";
import { getSession } from "../../../../hooks";

// TODO: Another redirect :( Necessary?
export const get: RequestHandler = async ({request}) => {
    // Checks if the user exists in the database, and if not, creates them
    await checkUser(request)

    return {
        status: 302,
        headers: {
            location: "/"
        }
    }
}

async function checkUser(request: Request) {
    const user = (await getSession({request})).user
    if (user === false) return // not logged in

    const userData = await getUserByDiscordId(user.id)
    if (userData === null) { // not in database
        await createUser(user.id, user.username) // create user
    }
}