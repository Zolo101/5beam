// throw new Error("@migration task: Update +server.js (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292701)");

import type { RequestHandler } from "@sveltejs/kit";
import { getUserById } from "../../../../talk/get";
import { getSession } from "../../../../hooks";
import { createLevel } from "../../../../talk/create";
import { oauth } from "../../../../lib/auth";
import validate from "../../../../client/FileValidator";

type PostFormData = {
    access_token: string;
    title: string;
    description: string;
    data: string;
}

export const post: RequestHandler = async ({request}) => {
    const data: any = {};
    const formData = await request.formData()

    // Turn formData into an object
    // TODO: idk why this gives a typescript error
    // @ts-ignore
    for (let field of formData) {
        const [key, value] = field;
        data[key] = value;
    }

    // Get user from cookie, otherwise access_token
    const user = await getDiscordUser(request, data.access_token);

    if (user === false) {
        return new Response("You must be logged in to create things", {status: 401})
    }

    if (!await validateData(data)) {
        // is this still true post-migrate?
        // TODO: This doesnt return well (returns as JSON even though it isn't)

        return new Response("Invalid FormData", {status: 400})
    }

    // console.log(data, user)
    const fileText = await data.file.text()
    // console.log(fileText)

    // TODO: Remove non-null symbol
    // This is to get the user's ID rather than Discord ID
    const userDBID = (await getUserById({discordId: user.id }))!.id

    const level = await createLevel({
        creatorId: userDBID,
        title: data.title,
        description: data.description,
        data: fileText
    })

    return new Response(level, {status: 200})
}

export async function validateData(data: any) {
    if (data.title.length === 0 || data.title.length > 64) return false;
    if (data.description.length === 0 || data.description.length > 1024) return false;
    if (data.file.size === 0 || data.file.size > 1_000_000) return false; // 1 megabyte

    const fileText = await data.file.text()
    if (validate(fileText).errors.length !== 0) return false;
    // console.log(data.title.length, data.description.length, data.file.size)
    return true;
}

export async function getDiscordUser(request: Request, access_token?: string) {
    return (access_token) ? await oauth.getUser(access_token) : (await getSession({request})).user;
}