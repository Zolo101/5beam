import type { RequestHandler } from "@sveltejs/kit";

// External websites only. 5beam please use actions
// TODO: Maybe we can merge the two?
export const POST: RequestHandler = async ({ locals }) => {
    locals.pb.authStore.clear();

    return new Response(null, {
        status: 200
    });
};
