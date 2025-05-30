import Pocketbase from "pocketbase";

// prod
export const pb = new Pocketbase("https://cdn.zelo.dev");
export const users = pb.collection("5beam_users_discord");
export const levels = pb.collection("5beam_levels");
export const levelpacks = pb.collection("5beam_levelpacks");

export const dailyies = pb.collection("5beam_daily");
export const weeklies = pb.collection("5beam_weekly_challenges");

export function logOut() {
    pb.authStore.clear();
}
