import Pocketbase from "pocketbase";
import { clean } from "../talk/get";

// prod
export const pb = new Pocketbase("https://cdn.zelo.dev");
/** @deprecated Use `usersV2` */
export const users = pb.collection("5beam_users_discord");
export const usersV2 = pb.collection("5beam_users");
export const levels = pb.collection("5beam_levels");
export const levelpacks = pb.collection("5beam_levelpacks");

export const dailyies = pb.collection("5beam_daily");
export const weeklies = pb.collection("5beam_weekly_challenges");

pb.afterSend = (response, data) => {
    const c = clean(data);
    // console.log(response.url, Object.keys(c));
    return c;
};

export function logOut() {
    pb.authStore.clear();
}
