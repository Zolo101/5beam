import Pocketbase from "pocketbase";
// import { requestToken } from "$lib/auth";

// prod
export const pb = new Pocketbase("https://cdn.zelo.dev")
export const users = pb.collection("5beam_users_discord")
export const levels = pb.collection("5beam_levels")
export const levelpacks = pb.collection("5beam_levelpacks")

export async function logIn() {
    // requestToken()
    // // importDatabase()
    //
    // const authData = await pb
    //     .collection("5beam_users_discord")
    //     .authWithOAuth2({provider: "discord"})
}

export function logOut() {
    pb.authStore.clear()
}