import Pocketbase from "pocketbase";
import { clean } from "../talk/get";

// prod
// TODO: Rename to clientPb
export const pb = new Pocketbase("https://cdn.zelo.dev");
export const usersV2 = pb.collection("5beam_users_public");
// TODO: Delete
export const usersV2Private = pb.collection("5beam_users");
export const levels = pb.collection("5beam_levels");
export const levelpacks = pb.collection("5beam_levelpacks");

export const dailyies = pb.collection("5beam_daily");
export const weeklies = pb.collection("5beam_weekly_challenges");

// TODO: This does ruin the types, but I believe you can change the types from the pocketbase client
pb.afterSend = (_, data) => {
    return clean(data);
};
