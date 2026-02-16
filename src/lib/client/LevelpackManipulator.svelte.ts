import { zip } from "$lib/misc";
import {
    validateFile,
    type DetectedLevel,
    type DetectedLevelMeta,
    type ValidateResult
} from "./FileValidator";

type ConsumedFile = {
    file: File;
    consumed: boolean;

    /** For database related, one per level */
    meta?: DetectedLevelMeta[];

    /** For styles */
    tag: string;
};

// TODO: better invalid handling
/** Utility class that lets you manipulate levelpacks before they're uploaded or updated.
 *
 *  Changing the mod name will clear the current levelpack.
 *
 *  Use the json method to get the result. */
export default class LevelpackManipulator {
    levelpack: ValidateResult = $state({
        levels: [],
        globalLogs: [],
        valid: true
    });

    private _files: ConsumedFile[] = $state([]);
    get files() {
        return this._files.map((f) => f.file);
    }

    idCounter = 0;

    private _mod: string = $state("");
    set mod(newMod: string) {
        this._mod = newMod;
        this.clear();
    }
    get mod() {
        return this._mod;
    }

    /**
     *
     * @param tag What tag should the default levels have
     * @param file File to get levels from
     * @param meta Meta to inject (like DB stuff)
     */
    constructor(file?: File, meta?: DetectedLevelMeta[]) {
        if (file) {
            this._files.push({ file, consumed: false, tag: "default", meta });
        }
    }

    addFiles(tag: string, ...newFiles: File[]) {
        for (const file of newFiles) {
            this._files.push({ file, consumed: false, tag });
        }
    }

    getLevelsByTag(tag: string) {
        return this.levelpack.levels.filter((level) => level.meta.tag === tag);
    }

    isEmpty() {
        if (this.mod) {
            // throw new Error("Cannot check if empty in modded mode. Use the files instead.");
            return this._files.length === 0;
        } else {
            return this.levelpack.levels.length === 0;
        }
    }

    clear() {
        this.levelpack = {
            levels: [],
            globalLogs: [],
            valid: true
        };
        this._files = [];
        this.idCounter = 0;
    }

    /** Validates all files and stores the results in the levelpack.
     * This clears the levelpack before running. */
    async gatherAndComputeValidations() {
        const results: ValidateResult[] = [];

        if (this.mod) {
            throw new Error("Cannot compute validity in modded mode.");
        }

        for (const consumableFile of this._files.filter((f) => !f.consumed)) {
            const result = await validateFile(consumableFile.file);
            if (result.valid) {
                // Import global logs correctly
                for (let i = 0; i < result.globalLogs.length; i++) {
                    const log = result.globalLogs[i];
                    this.levelpack.globalLogs.push({
                        at: log.at + this.levelpack.levels.length,
                        message: log.message,
                        level: log.level
                    });
                }

                // Then import the levels
                for (let i = 0; i < result.levels.length; i++) {
                    const level = result.levels[i];

                    level.meta.tag = consumableFile.tag;
                    level.id = this.idCounter;
                    this.idCounter++;
                    this.levelpack.levels.push(level);
                }

                if (consumableFile.meta) {
                    for (const [level, metaItem] of zip(
                        this.levelpack.levels,
                        consumableFile.meta
                    )) {
                        level.meta = metaItem;
                    }
                }
            }
            consumableFile.consumed = true;

            results.push(result);
        }

        return results;
    }

    /** Removes levels from the current levelpack. */
    removeLevel(level: DetectedLevel) {
        if (this.mod) {
            throw new Error("Cannot remove levels in modded mode.");
        }

        const index = this.levelpack.levels.indexOf(level);
        this.levelpack.levels.splice(index, 1);

        // TODO: Do we need to do this?
        // Remove associated global logs
        this.levelpack.globalLogs = this.levelpack.globalLogs.filter((log) => log.at !== index);
    }

    /** Updates given properties in a level. */
    editLevel(level: DetectedLevel, newLevelData: Partial<DetectedLevel>) {
        if (this.mod) {
            throw new Error("Cannot edit levels in modded mode.");
        }

        Object.assign(level, newLevelData);
    }

    toJson() {
        return this.levelpack;
    }

    /** Exports the levelpack as if it were a levels.txt file.
     *  If in modded mode, it will attempt to
     */
    async toRaw() {
        if (this.mod) {
            let output = "";
            for (const file of this.files) {
                output += (await file.text()) + "\n\n";
            }
            return output;
        } else {
            let output = "";
            for (let i = 0; i < this.levelpack.levels.length; i++) {
                const level = this.levelpack.levels[i];
                output += level.raw + "\n\n";
            }
            return output;
        }
    }

    /**
     * Exports the levelpack as a payload for /api/create/levelpack (or level)
     */
    async toPayload(title: string, description: string) {
        return {
            title,
            description,
            diffculties: this.levelpack.levels.map((level) => level.meta.difficulty || 0),
            modded: this._mod,
            file: await this.toRaw()
        };
    }
}
