import { DENIED, MY_BAD, OK, NOT_FOUND } from "../../../../misc";
import { getDaily } from "../../../../talk/get";
import { tryGettingUser } from "../../../../talk/admin";
import { isAdmin } from "../../../../misc";
import { addDailyLevel } from "../../../../talk/create";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
    return OK(await getDaily());
};

export const POST: RequestHandler = async ({ cookies, url }) => {
    const id = url.searchParams.get("id");

    const access_token = cookies.get("access_token") ?? "";
    const refresh_token = cookies.get("refresh_token") ?? "";

    const user = await tryGettingUser(access_token, refresh_token, cookies);
    if (!user) return DENIED();

    const allowed = isAdmin(user);
    if (!allowed) return DENIED();

    if (id) {
        try {
            await addDailyLevel(id);
            return OK();
        } catch (e) {
            return MY_BAD("Failed to add level to dailyies");
        }
    } else {
        return NOT_FOUND();
    }
};
