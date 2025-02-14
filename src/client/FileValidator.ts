import { z } from "zod";
import type { Writable } from "svelte/store";

export type ValidateLog = z.infer<typeof validateLogSchema>

export type ValidateResult = z.infer<typeof validateResultSchema>

export type DetectedLevel = z.infer<typeof detectedLevelSchema>

export type Sprite = z.infer<typeof spriteSchema>

export type Dialogue = z.infer<typeof dialogueSchema>

export const validateLogSchema = z.object({
    at: z.number(),
    message: z.string(),
    level: z.union([z.literal("info"), z.literal("warning"), z.literal("error")])
})

export async function validateFile(r: Writable<ValidateResult | undefined>, f: File | undefined) {
    if (f) {
        console.log(f)
        if (f.size > 1_000_000) return alert("File too big! (1MB MAX)")
        if (f.type !== "text/plain") return alert("File must be a .txt file!")

        r.set(validate(await f.text()))
    }
}

const spriteSchema = z.object({
    entityId: z.number(),
    x: z.number(),
    y: z.number(),
    roleId: z.number(),
    motionSpeed: z.number().optional(),
    motionPath: z.string().optional()
})

const dialogueSchema = z.object({
    entityOrder: z.number(),
    emotion: z.union([z.literal("H"), z.literal("S")]),
    text: z.string()
})

export const detectedLevelSchema = z.object({
    id: z.number(),
    name: z.string().max(64),
    width: z.number(),
    height: z.number(),
    spriteNumber: z.number(),
    background: z.number(),
    levelType: z.union([z.literal("L"), z.literal("H")]),
    data: z.string(),
    sprites: z.array(spriteSchema),
    dialogues: z.array(dialogueSchema),
    deathsRequired: z.number(),
    logs: z.array(validateLogSchema),
    raw: z.string()
})

export const validateResultSchema = z.object({
    levels: z.array(detectedLevelSchema),
    globalLogs: z.array(validateLogSchema),
    valid: z.boolean()
})


function validate(file: string) {
    const result: ValidateResult = {
        levels: [],
        globalLogs: [],
        valid: true
    }
    const data = file
        .trim()
        .replaceAll("\r\n", "\n")
        .split("\n")

    try {
        // Remove first line if its just "loadedLevels="
        if (data[0].trim() === "loadedLevels=") data.shift()

        const levels = data.join("\n").split("\n\n")
        let i = 0;
        for (const level of levels) {
            try {
                i += 1;
                result.levels.push(processLevel(result, level, i))
            } catch (e) {
                result.globalLogs.push(createError(0, "Malformed level / levelpack. Are you sure this is a BFDIA 5b level file?"))
                result.valid = false;
                console.error(e)
            }
        }

        // Invalidate if any level has an error log
        result.valid = !result.levels
            .some(l => l.logs
                .some(l => l.level === "error"))

    } catch (e) {
        result.globalLogs.push(createError(0, "Malformed level / levelpack. Are you sure this is a BFDIA 5b level file?"))
        result.valid = false;
        console.error(e)
    }

    return result
}

function createLog(at: number, message: string, level: ValidateLog["level"]): ValidateLog {
    return {
        at,
        message,
        level
    }
}

function createError(at: number, message: string): ValidateLog {
    return {
        at,
        message,
        level: "error"
    }
}

function processLevel(result: ValidateResult, level: string, id: number): DetectedLevel {
    const logs: ValidateLog[] = []

    const lines = level.split("\n")
    const name = lines[0]
    if (name.length > 64) logs.push(createError(id, `Level name must be 64 characters or less!`))

    const props = lines[1].split(",")

    // props
    const width = Number(props[0])
    const height = Number(props[1])
    const spriteNumber = Number(props[2])
    const background = Number(props[3])
    const type = props[4]
    // if (width < 32 || width > 99) logs.push(createError((`${name} has a width of ${width} which is not between 32 and 99`)
    // if (height < 18 || height > 99) logs.push(createError((`${name} has a height of ${height} which is not between 18 and 99`)
    if (spriteNumber < 1) logs.push(createError(id, `Each level needs at least one sprite!`))
    if (background < 0 || background > 15) logs.push(createError(id, `The background index given: '${background}' is not between 0 and 15`))
    if (type != "L" && type != "H") logs.push(createError(id, `The level type is '${type}' which is not 'L' or 'H'`))

    // level data
    const levelData = lines.slice(2, 2 + height).join("")
    switch (type) {
        case "L":
            if (levelData.length !== (width * height)) logs.push(createError(id, `'${name}' level data size is not the same as the specified size (width, height) in the level properties`))
            break

        case "H":
            if (levelData.length !== (width * height * 2)) logs.push(createError(id, `'${name}' level data size is not the same as the specified size (width, height) in the level properties`))
            break
    }
    if (levelData.indexOf("4") === -1) logs.push(createError(id, `A finish block is required!`))
    if (levelData.indexOf(":") === -1) logs.push(createLog(id, `A win-token is optional but recommended`, "warning"))

    // sprite data
    const sprites = processSprites(logs, lines.slice(2 + height, 2 + height + spriteNumber), id)

    const dialogueLength = Number(lines[2 + height + spriteNumber])
    if (Number.isNaN(dialogueLength)) logs.push(createError(id, `Dialogue length number is missing! If your level has zero dialogue, just add "00" above the required deaths number.`))
    const dialogues = lines.slice(2 + height + spriteNumber + 1, 2 + height + spriteNumber + 1 + dialogueLength)
    if (dialogueLength !== dialogues.length) logs.push(createError(id, `The dialogue length number does not match the amount of dialogue lines in the level file!`))
    const processedDialogues = processDialogue(logs, dialogues, id)
    const deathsRequired = Number(lines[2 + height + spriteNumber + 1 + dialogueLength])
    if (Number.isNaN(deathsRequired)) logs.push(createError(id, `The deaths required to beat this level is missing! If your level can be beaten with zero deaths, just add "000000" to the end of your level file.`))

    return {
        id: id,
        name: name,
        width: width,
        height: height,
        spriteNumber: spriteNumber,
        background: background,
        levelType: type as DetectedLevel["levelType"],
        data: levelData,
        sprites: sprites,
        dialogues: processedDialogues,
        deathsRequired: deathsRequired,
        logs: logs,
        raw: level
    }
}

function processSprites(logs: ValidateLog[], sprites: string[], id: number): Sprite[] {
    const spriteArr = []
    if (sprites.length === 0) logs.push(createLog(id,"No sprites found", "warning"))

    // entity_id, x, y, role_id, m_speed + m_string
    let i = 1;
    for (const sprite of sprites) {
        const spriteProps = sprite.split(",")
        const entityId = Number(spriteProps[0])
        const x = Number(spriteProps[1])
        const y = Number(spriteProps[2])
        const roleIdAndMotionSpeedAndString = spriteProps[3]
        const [roleIdString, motionSpeedAndString] = roleIdAndMotionSpeedAndString.split(" ")
        const roleId = Number(roleIdString)
        let motionSpeed;
        let motionPath;

        // console.log(roleIdAndMotionSpeedAndString, roleIdString, motionSpeedAndString)

        if (motionSpeedAndString) {
            motionSpeed = Number(motionSpeedAndString.slice(0, 1))
            motionPath = motionSpeedAndString.slice(2)
            if (motionSpeed < 0 || motionSpeed > 99) logs.push(createError(id, `Sprite ${i} has a motion speed of ${motionSpeed} which is not between 0 and 99`))
        }

        if (Number.isNaN(entityId)) logs.push(createError(id, `Sprite ${i} has an entity id of '${spriteProps[0]}' which is not a number`))
        if (Number.isNaN(x)) logs.push(createError(id, `Sprite ${i} has an x coordinate of '${spriteProps[1]}' which is not a number`))
        if (Number.isNaN(y)) logs.push(createError(id, `Sprite ${i} has an y coordinate of '${spriteProps[2]}' which is not a number`))
        if (Number.isNaN(roleId)) logs.push(createError(id, `Sprite ${i} has an role id of '${roleIdString}' which is not a number`))
        if (Number.isNaN(motionSpeed)) logs.push(createError(id, `Sprite ${i} has an motion speed of '${motionSpeed}' which is not a number`))
        if (Number.isNaN(motionPath)) logs.push(createError(id, `Sprite ${i} has an motion path of '${motionPath}' which is not a number`))

        if (entityId < 0 || entityId > 99) logs.push(createError(id, `Sprite ${i} has an entity id of ${entityId} which is not between 0 and 99`))
        // if (x < 0 || x > 99) logs.push(createError((`Sprite ${i} has an x of ${x} which is not between 0.00 and 99.00`)
        // if (y < 0 || y > 99) logs.push(createError((`Sprite ${i} has an y of ${y} which is not between 0.00 and 99.00`)
        if (roleId < 0 || roleId > 99) logs.push(createError(id, `Sprite ${i} has a role id of ${roleId} which is not between 0 and 99`))

        i += 1;

        spriteArr.push({
            entityId: entityId,
            x: x,
            y: y,
            roleId: roleId,
            motionSpeed: motionSpeed,
            motionPath: motionPath,
        })
    }

    return spriteArr
}

function processDialogue(logs: ValidateLog[], dialogue: string[], id: number) {
    const dialogueArr = []
    // entity_id, emotion, text
    let i = 1;
    for (const line of dialogue) {
        const entityIdAndEmotion = line.slice(0, 3)
        const text = line.slice(3).trim()
        const entityId = Number(entityIdAndEmotion.slice(0, 2))
        const emotion = entityIdAndEmotion.slice(2)

        // console.log(entityId, emotion, text)

        if (entityId < 0 || entityId > 99) logs.push(createError(id, `Dialogue ${i} has an entity id of ${entityId} which is not between 0 and 99`))
        if (emotion != "H" && emotion != "S") logs.push(createError(id, `Dialogue ${i} has an emotion of '${emotion}' which is not 'H' or 'S'`))

        i += 1;

        dialogueArr.push({
            entityOrder: entityId,
            emotion: emotion as Dialogue["emotion"],
            text: text,
        })
    }

    return dialogueArr
}

export default validate;