import type { RequestHandler } from "@sveltejs/kit";
import { getUserByProps } from "../../../talk/get";
import { getSession } from "../../../hooks";
import { createLevelpack } from "../../../talk/create";
import { validateData } from "./level";

export const post: RequestHandler = async ({request}) => {
    const user = (await getSession({request})).user;
    if (user === false) {
        return {
            status: 401,
            body: "You must be logged in to create things"
        }
    }

    const formData = await request.formData()
    const data: any = {};

    // TODO: idk why this gives a typescript error
    // @ts-ignore
    for (let field of formData) {
        const [key, value] = field;
        data[key] = value;
    }

    if (!validateData(data)) {
        // TODO: This doesnt return well (returns as JSON even though it isn't)
        return {
            status: 400,
            body: "Invalid FormData"
        }
    }

    // console.log(data, user)
    const fileText: string = await data.file.text()

    // remove loadedLevels=
    let levels = fileText.split("\r\n").splice(1).join("\r\n").split("\r\n\r\n")
    levels = levels.map(level => "loadedLevels=\r\n" + level)

    // console.log(fileText)

    // TODO: Remove non-null symbol
    // This is to get the user's ID rather than Discord ID
    console.log(user)
    const userDBID = (await getUserByProps({discordId: user.id }))!.id

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

    return {
        status: 200,
        body: levelpack
    }
}