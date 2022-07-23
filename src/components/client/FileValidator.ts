export type ValidateResult = {
    levels: DetectedLevel[],
    errors: string[],
    warnings: string[],
}

type DetectedLevel = {
    id: number
    name: string
    width: number
    height: number
    spriteNumber: number
    background: number
    levelType: "L" | "H"
    data: string

    sprites: Sprite[]
    dialogues: Dialogue[]
    deathsRequired: number

    errors: string[]
    warnings: string[]
}

type Sprite = {
    entityId: number
    x: number
    y: number
    roleId: number
    motionSpeed?: number
    motionPath?: string
}

type Dialogue = {
    entityOrder: number
    emotion: "H" | "S"
    text: string
}

function validate(file: string) {
    const result: ValidateResult = {
        levels: [],
        errors: [],
        warnings: []
    }
    const data = file
        .trim()
        .replaceAll("\r\n", "\n")
        .split("\n")

    // Remove first line if its just "loadedLevels="
    if (data[0].trim() === "loadedLevels=") data.shift()

    const levels = data.join("\n").split("\n\n")
    let i = 0;
    for (const level of levels) {
        try {
            i += 1;
            result.levels.push(processLevel(result, level, i))
        } catch (e) {
            result.errors.push(`ERROR PROCESSING LEVEL ${i}, Make sure the level properties are correct!`)
            console.error(e)
        }
    }
    return result
}

function processLevel(result: ValidateResult, level: string, id: number): DetectedLevel {
    const errors: string[] = []
    const warnings: string[] = []

    const lines = level.split("\n")
    const name = lines[0]
    const props = lines[1].split(",")

    // props
    const width = Number(props[0])
    const height = Number(props[1])
    const spriteNumber = Number(props[2])
    const background = Number(props[3])
    const type = props[4]
    if (width < 32 || width > 99) errors.push(`${name} has a width of ${width} which is not between 32 and 99`)
    if (height < 18 || height > 99) errors.push(`${name} has a height of ${height} which is not between 18 and 9`)
    if (spriteNumber < 0 || spriteNumber > 99) errors.push(`${name} has a sprite number of ${spriteNumber} which is not between 0 and 99`)
    if (background < 0 || background > 15) errors.push(`${name} has a background of ${background} which is not between 0 and 15`)
    if (type != "L" && type != "H") errors.push(`${name} has a level type of '${type}' which is not 'L' or 'H'`)

    // level data
    const levelData = lines.slice(2, 2 + height).join("")
    switch (type) {
        case "L":
            if (levelData.length !== (width * height)) errors.push(`'${name}' level data size is not the same as the specified size (width, height) in the level properties`)
            break

        case "H":
            if (levelData.length !== (width * height * 2)) errors.push(`'${name}' level data size is not the same as the specified size (width, height) in the level properties`)
            break
    }
    if (levelData.indexOf("4") === -1) errors.push(`${name} has no '4' (finish block) in the level data`)
    if (levelData.indexOf(":") === -1) warnings.push(`${name} has no ':' (win-token block) in the level data`)

    // sprite data
    const sprites = processSprites(errors, warnings, lines.slice(2 + height, 2 + height + spriteNumber))

    const dialogueLength = Number(lines[2 + height + spriteNumber])
    const dialogues = lines.slice(2 + height + spriteNumber + 1, 2 + height + spriteNumber + 1 + dialogueLength)
    const processedDialogues = processDialogue(errors, warnings, dialogues)
    const deathsRequired = Number(lines[2 + height + spriteNumber + 1 + dialogueLength])

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
        errors: errors,
        warnings: warnings,
    }
}

function processSprites(errors: string[], warnings: string[], sprites: string[]): Sprite[] {
    const spriteArr = []
    if (sprites.length === 0) warnings.push("No sprites found")

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
            if (motionSpeed < 0 || motionSpeed > 99) errors.push(`Sprite ${i} has a motion speed of ${motionSpeed} which is not between 0 and 99`)
        }

        if (entityId < 0 || entityId > 99) errors.push(`Sprite ${i} has an entity id of ${entityId} which is not between 0 and 99`)
        if (x < 0 || x > 99) errors.push(`Sprite ${i} has an x of ${x} which is not between 0.00 and 99.00`)
        if (y < 0 || y > 99) errors.push(`Sprite ${i} has an y of ${y} which is not between 0.00 and 99.00`)
        if (roleId < 0 || roleId > 99) errors.push(`Sprite ${i} has a role id of ${roleId} which is not between 0 and 99`)

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

function processDialogue(errors: string[], warnings: string[], dialogue: string[]) {
    const dialogueArr = []
    // entity_id, emotion, text
    let i = 1;
    for (const line of dialogue) {
        const entityIdAndEmotion = line.slice(0, 3)
        const text = line.slice(3).trim()
        const entityId = Number(entityIdAndEmotion.slice(0, 2))
        const emotion = entityIdAndEmotion.slice(2)

        // console.log(entityId, emotion, text)

        if (entityId < 0 || entityId > 99) errors.push(`Dialogue ${i} has an entity id of ${entityId} which is not between 0 and 99`)
        if (emotion != "H" && emotion != "S") errors.push(`Dialogue ${i} has an emotion of '${emotion}' which is not 'H' or 'S'`)

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