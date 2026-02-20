import { form } from "$app/server";
import { redirect } from "@sveltejs/kit";
import { createObjectSchema } from "./parse";
import { _deleteLevel, _deleteLevelpack } from "./server/delete";

const reportLevelSchema = createObjectSchema("id");
const reportLevelpackSchema = createObjectSchema("id", "cascade");
export const deleteLevel = form(reportLevelSchema, async (obj) => {
    const res = await _deleteLevel(obj);
    if (res.ok) redirect(303, "/");
    return res;
});
export const deleteLevelpack = form(reportLevelpackSchema, async (obj) => {
    console.log(obj);

    const res = await _deleteLevelpack(obj);
    if (res.ok) redirect(303, "/");
    return res;
});
