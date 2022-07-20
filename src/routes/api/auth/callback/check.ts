import type { RequestHandler } from "@sveltejs/kit";
import { getUserByProps } from "../../../../talk/get";
import { getSession } from "../../../../hooks";
import { createUser } from "../../../../talk/create";

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

    const userData = await getUserByProps({discordId: user.id})
    if (userData === null) { // not in database
        await createUser({
            discordId: user.id,
            name: user.username
        }) // create user
    }
}