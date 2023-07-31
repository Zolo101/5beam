/*
import type { RequestHandler } from "@sveltejs/kit";
import { getUserById } from "../../../../talk/get";
// import { createLevelpack } from "../../../../talk/create";
import { getDiscordUser, validateData } from "../level/+server";


export const post: RequestHandler = async ({request}) => {
    const formData = await request.formData()
    const data: any = {};

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
    const fileText: string = await data.file.text()

    // remove loadedLevels=
    let levels = fileText.split("\n").splice(1).join("\n").split("\n\n")
    // levels = levels.map(level => "loadedLevels=\r\n" + level)

    // console.log(fileText)

    // TODO: Remove non-null symbol
    // This is to get the user's ID rather than Discord ID
    console.log(user)
    const userDBID = (await getUserById({discordId: user.id }))!.id

    const levelsParamArray = levels.map((level, index) => {
        const i = index + 1;
        return {
            creatorId: userDBID,
            title: `${data.title}, Pt. ${i.toString().padStart(3, "0")}`,
            description: `Part ${i} of the levelpack: '${data.title}'`,
            data: level,
            levelpackPart: i
        }
    })

    const levelpack = await createLevelpack({
        creatorId: userDBID,
        title: data.title,
        description: data.description,
        levels: {
            create: levelsParamArray
        }
    })

    return new Response(levelpack, {status: 200})
}
*/