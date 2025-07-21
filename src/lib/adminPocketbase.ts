import { ADMIN_EMAIL, ADMIN_PASSWORD } from "$env/static/private";
import Pocketbase from "pocketbase";

/** Server-side only. Importing this into client-side code will cause an error. */
export const adminPb = new Pocketbase("https://cdn.zelo.dev");
adminPb.collection("_superusers").authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
