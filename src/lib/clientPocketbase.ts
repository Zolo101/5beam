import Pocketbase from "pocketbase";
import { clean } from "$lib/server/get";
import {
    type Daily,
    type Level,
    type Levelpack,
    type PrivateBaseUserV2,
    type WeeklyChallenge
} from "./types";

/** CLIENT ONLY! Use Locals for server pocketbase */
export const clientPb = new Pocketbase("https://cdn.zelo.dev");

export const usersV2 = clientPb.collection<PrivateBaseUserV2["record"]>("5beam_users_public");
export const levels = clientPb.collection<Level>("5beam_levels");
export const levelpacks = clientPb.collection<Levelpack>("5beam_levelpacks");

/** @deprecated We should be using the API instead */
export const levelStars = clientPb.collection<LevelStarred>("5beam_level_stars");
/** @deprecated We should be using the API instead */
export const levelpackStars = clientPb.collection<LevelpackStarred>("5beam_levelpack_stars");

export const dailyies = clientPb.collection<Daily>("5beam_daily");
export const weeklies = clientPb.collection<WeeklyChallenge>("5beam_weekly_challenges");

// TODO: This does ruin the types, but I believe you can change the types from the pocketbase client
clientPb.afterSend = (_, data) => {
    return clean(data);
};
