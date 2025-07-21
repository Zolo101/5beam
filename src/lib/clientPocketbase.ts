import Pocketbase from "pocketbase";
import { clean } from "$lib/talk/get";

/** CLIENT ONLY! Use Locals for server pocketbase */
export const clientPb = new Pocketbase("https://cdn.zelo.dev");
export const usersV2 = clientPb.collection("5beam_users_public");
// TODO: Delete
export const usersV2Private = clientPb.collection("5beam_users");
export const levels = clientPb.collection("5beam_levels");
export const levelpacks = clientPb.collection("5beam_levelpacks");

export const dailyies = clientPb.collection("5beam_daily");
export const weeklies = clientPb.collection("5beam_weekly_challenges");

// TODO: This does ruin the types, but I believe you can change the types from the pocketbase client
clientPb.afterSend = (_, data) => {
    return clean(data);
};
