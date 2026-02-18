import Pocketbase from "pocketbase";
import { clean } from "$lib/server/get";
import {
    type Character,
    type Daily,
    type Level,
    type Levelpack,
    type LevelpackStarred,
    type LevelStarred,
    type PrivateBaseUserV2,
    type WeeklyChallenge
} from "./types";

/** CLIENT ONLY! Use Locals for server pocketbase
 * @deprecated We should be using the API instead
 */
export const clientPb = new Pocketbase("https://cdn.zelo.dev");

/** @deprecated We should be using the API instead */
export const usersV2 = clientPb.collection<PrivateBaseUserV2["record"]>("5beam_users_public");
/** @deprecated We should be using the API instead */
export const levels = clientPb.collection<Level>("5beam_levels");
/** @deprecated We should be using the API instead */
export const trending = clientPb.collection<Level>("5beam_trending");
/** @deprecated We should be using the API instead */
export const levelpacks = clientPb.collection<Levelpack>("5beam_levelpacks");

/** @deprecated We should be using the API instead */
export const levelStars = clientPb.collection<LevelStarred>("5beam_level_stars");
/** @deprecated We should be using the API instead */
export const levelpackStars = clientPb.collection<LevelpackStarred>("5beam_levelpack_stars");

/** @deprecated We should be using the API instead */
export const characters = clientPb.collection<Character>("5beam_characters");

/** @deprecated We should be using the API instead */
export const dailyies = clientPb.collection<Daily>("5beam_daily");
/** @deprecated We should be using the API instead */
export const weeklies = clientPb.collection<WeeklyChallenge>("5beam_weekly_challenges");

// Not a good feature, it just causes issues with multiple requests being made in the same collection
// clientPb.autoCancellation(false);

// TODO: This does ruin the types, but I believe you can change the types from the pocketbase client
clientPb.afterSend = (_, data) => {
    return clean(data);
};
