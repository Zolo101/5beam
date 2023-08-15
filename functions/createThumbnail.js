import { renderImage } from "$lib/5b.js"
import { createCanvas, Image } from "canvas";

function newlineSplitter(file) {
    return file
        .replaceAll(/\\r?\\n/g, "\r\n") // convert to windows linebreaks (HTML5b requires this)
}

export const handler = async (event) => {
    let ctx
    const file = newlineSplitter(event.body)

    try {
        const canvas = createCanvas(960, 540)
        ctx = canvas.getContext('2d')
        await renderImage(ctx, Image, file, createCanvas)
        const dataURL = canvas.toDataURL("image/png")

        return {
            statusCode: 200,
            headers: {
                'content-type': "image/png",
            },
            body: dataURL.replace('data:image/png;base64,', ''),
            isBase64Encoded: true
        }
    } catch (error) {
        console.error(error)
        return { statusCode: 500, body: error.toString() }
    }
}