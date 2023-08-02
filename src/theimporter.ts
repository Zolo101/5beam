// i am the... IMPORTER!!!
import Users from "./5bb/User.json"
import Levels from "./5bb/Level.json"
import { pb } from "$lib/pocketbase";


export async function importDatabase() {
    let userMap = new Map<number, string>();

    for (const user of Users) {
        const formattedUser = {
            type: "discord",
            discordId: user.discordId,
            username: user.name,
            levels: [],
            // playlists: [],
            stars: [],
        }

        const record = await pb.collection("5beam_users_discord").create(formattedUser)
        userMap.set(user.id, record.id);
    }

    console.log(Array.from(userMap.entries()))
    console.log("Done with users!")

    for (const level of Levels) {
        const user = userMap.get(level.creatorId);
        if (!user) throw new Error("User not found in level ID" + level.id);

        const formattedLevel = {
            creator: user,

            title: level.title,
            description: level.description,
            data: level.data,

            plays: level.plays,
            difficulty: level.difficulty,
            featured: level.featured
        }

        const record = await pb.collection("5beam_levels").create(formattedLevel)

        let userLevelsArray = (await pb.collection("5beam_users_discord").getOne(user)).levels;
        if (userLevelsArray === undefined) {
            userLevelsArray = [record.id]
        } else {
            console.log(userLevelsArray)
            userLevelsArray.push(record.id)
        }

        await pb.collection("5beam_users_discord").update(user, {levels: userLevelsArray})
    }

    console.log("Done!")
}