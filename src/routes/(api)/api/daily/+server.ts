import { DENIED, MY_BAD, OK, BAD } from "../../../../misc";
import { getDaily } from "../../../../talk/get";
import { tryGettingUser } from "../../../../talk/admin";
import { isAdmin } from "../../../../misc";
import { addDailyLevel } from "../../../../talk/create";
import type { RequestHandler } from "./$types";
import { createObjectSchema } from "$lib/parse";

export const GET: RequestHandler = async () => {
    return OK(await getDaily());
};

const urlSchema = createObjectSchema("id");
const cookiesSchema = createObjectSchema("access_token", "refresh_token");
export const POST: RequestHandler = async ({ cookies, url }) => {
    try {
        const { id } = urlSchema.parse(url);
        const { access_token, refresh_token } = cookiesSchema.parse(cookies);

        const user = await tryGettingUser(access_token, refresh_token, cookies);
        if (!user) return DENIED();

        const allowed = isAdmin(user);
        if (!allowed) return DENIED();

        try {
            await addDailyLevel(id);
            return OK();
        } catch {
            return MY_BAD("Failed to add level to dailyies");
        }
    } catch {
        return BAD();
    }
};
