import { command } from "$app/server";
import z from "zod";
import { adminPb } from "./server/adminPocketbase";
import { generateThumbnail } from "$lib/talk/create";
import type { Level } from "$lib/types";

const schema = z.object({ id: z.string(), data: z.string(), x: z.number(), y: z.number() });
export const editThumbnail = command(schema, async ({ id, data, x, y }) => {
    const [blockX, blockY] = [Math.floor(x / 30), Math.floor(y / 30)];

    const thumbnailResponse = await generateThumbnail(data, blockX, blockY);
    const thumbnailBlob = await thumbnailResponse.blob();
    const result = await adminPb
        .collection<Level>("5beam_levels")
        .update(id, { thumbnail: thumbnailBlob });
    return result.thumbnail;
});
