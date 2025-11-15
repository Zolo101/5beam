import { type Actions } from "@sveltejs/kit";
import { getLevelById, getRelatedLevels, reportKindById } from "$lib/server/get";
import type { PageServerLoad } from "./$types";
import { createObjectSchema } from "$lib/parse";

export const load: PageServerLoad = async ({ params }) => {
    const level = await getLevelById(params.id);
    const relatedLevels = await getRelatedLevels(level);
    return { level, relatedLevels };
};

const schema = createObjectSchema("reportKind", "reportReason", "reportDesc");
export const actions = {
    report: async ({ request, params }) => {
        const form = await request.formData();
        const { id } = params;
        const { reportKind, reportReason, reportDesc } = schema.parse(Object.fromEntries(form));

        await reportKindById(id!, reportKind, reportReason, reportDesc);
        return { success: true };
    }
} satisfies Actions;
