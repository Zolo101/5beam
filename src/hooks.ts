import { oauth } from "./lib/auth";
import cookie from "cookie";

// TODO: Figure out the type for request
export async function getSession(event: any) {
    const cookies = cookie.parse(event.request.headers.get("cookie") || '');

    // console.log("token:", cookies.access_token);
    if (cookies.access_token) {
        const user = await oauth.getUser(cookies.access_token);
        console.log(user)
        return {user}
    }

    return {
        user: false
    }
}
