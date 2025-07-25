import { adminPb } from "$lib/server/adminPocketbase";
import { isAdmin } from "$lib/misc";
import { DENIED } from "$lib/server/misc";
import type { PageServerLoad } from "./$types";

export const load = (async () => {
    const reports = await adminPb.collection("5beam_reports").getFullList({
        sort: "-created",
        filter: "resolved = false"
    });

    return { reports };
}) satisfies PageServerLoad;

export const actions = {
    resolve: async ({ request, locals }) => {
        if (!isAdmin(locals.user)) return DENIED();

        const formData = await request.formData();
        const reportId = formData.get("reportId") as string;
        await adminPb.collection("5beam_reports").update(reportId, { resolved: true });
    },
    // TODO: Only works for levels currently
    delete: async ({ request, locals }) => {
        if (!isAdmin(locals.user)) return DENIED();

        const formData = await request.formData();
        const kindId = formData.get("kindId") as string;
        const reportId = formData.get("reportId") as string;
        await adminPb.collection("5beam_levels").delete(kindId);
        await adminPb.collection("5beam_reports").update(reportId, { resolved: true });
    }
};
