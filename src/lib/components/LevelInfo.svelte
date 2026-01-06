<script lang="ts">
    import type { DetectedLevel } from "$lib/client/FileValidator";
    import { backgrounds, to5bLevelFormat } from "$lib/misc";
    import Table from "$lib/components/layout/Table.svelte";
    import Log from "./Log.svelte";
    import { generateThumbnailFull } from "$lib/talk/create";
    import type LevelpackManipulator from "$lib/client/LevelpackManipulator.svelte";

    interface Props {
        level: DetectedLevel | null;
        index: number;
        // if you want to change it's data
        manipulator?: LevelpackManipulator;
    }

    let { level, index, manipulator }: Props = $props();
    let tableSprites = $derived(
        level?.sprites.map((s) => Object.values(s).filter((v) => v !== undefined))
    );

    let tableDialogues = $derived(level?.dialogues.map((d) => Object.values(d)));

    // TODO: This is a duplicate of the ValidatedLevel.svelte function
    const getBackground = (background: number) =>
        backgrounds[`/src/lib/assets/backgrounds/${background}.png`].default;

    const thumbnail = $derived.by(async () => {
        const response = await generateThumbnailFull(level?.raw);
        return await response.blob();
    });
</script>

<!-- TODO: Move to Validator -->
{#if level}
    <div
        id="levelDetails"
        class="relative flex max-h-full flex-col gap-3 overflow-hidden rounded-lg p-5 text-xs text-white"
    >
        <div
            class="absolute -inset-4 -z-10 bg-cover bg-center blur-xs"
            style="background-image: url({getBackground(level.background)});"
            aria-hidden="true"
        ></div>
        <div class="flex flex-col items-start text-2xl">
            <div>
                <span>{to5bLevelFormat(index + 1)}.</span>
                <span class="font-bold">{level.name}</span>
            </div>
            <img
                src={URL.createObjectURL(await thumbnail)}
                alt="Level Thumbnail"
                class="max-h-200 w-100 rounded-md object-contain"
            />
        </div>
        <div class="flex content-between items-end gap-5 text-xl">
            <div class="flex w-full items-end gap-5">
                <div class="flex items-end gap-2">
                    <span class="code">{level.width}</span>
                    <span class="text-2xl font-black">×</span>
                    <span class="code">{level.height}</span>
                </div>
                <div>
                    {#if level.levelType === "L"}
                        <span class="code bg-green-500/50! text-green-300 outline-green-500/80!"
                            >L</span
                        >
                    {:else}
                        <span class="code bg-purple-500/50! text-purple-300 outline-purple-500/80!"
                            >H</span
                        >
                    {/if}
                </div>
            </div>
        </div>
        <div>
            <Table
                title="Sprites ({level.sprites.length})"
                heads={["Sprite ID", "X", "Y", "Role ID", "Motion Speed", "Motion Path"]}
                content={tableSprites}
            />
        </div>
        {#if level.dialogues.length > 0}
            <div class="w-100">
                <Table
                    title="Dialogues ({level.dialogues.length})"
                    heads={["Sprite ID", "Emotion", "Text"]}
                    content={tableDialogues}
                />
            </div>
        {/if}
        {#if level.logs.length > 0}
            <div class="info">
                <div class="rounded-sm bg-neutral-700/50 p-2.5 text-neutral-200">
                    {#each level.logs as log}
                        <Log {log} />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}
