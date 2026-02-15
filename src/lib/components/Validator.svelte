<script lang="ts">
    import ValidatedLevel from "./ValidatedLevel.svelte";
    import type LevelpackManipulator from "$lib/client/LevelpackManipulator.svelte";
    import { type DndEvent, dndzone } from "svelte-dnd-action";
    import { backgrounds, to5bLevelFormat } from "$lib/misc";
    import { generateThumbnailFull } from "$lib/talk/create";
    import Table from "./layout/Table.svelte";
    import Log from "./Log.svelte";
    import type { DetectedLevel } from "$lib/client/FileValidator";
    import Dialog from "./Dialog.svelte";
    import { flip } from "svelte/animate";

    interface Props {
        manipulator: LevelpackManipulator;
    }

    let { manipulator }: Props = $props();

    function handleDndConsiderPlaylist(e: CustomEvent<DndEvent<any>>) {
        manipulator.levelpack.levels = e.detail.items;
    }

    function handleDndFinalizePlaylist(e: CustomEvent<DndEvent<any>>) {
        manipulator.levelpack.levels = e.detail.items;
    }

    let selectedLevel = $state<DetectedLevel | null>(null);
    let selectedLevelIndex = $state<number | null>(null);

    let tableSprites = $derived(
        selectedLevel?.sprites.map((s) => Object.values(s).filter((v) => v !== undefined))
    );

    let tableDialogues = $derived(selectedLevel?.dialogues.map((d) => Object.values(d)));

    // TODO: This is a duplicate of the ValidatedLevel.svelte function
    const getBackground = (background: number) =>
        backgrounds[`/src/lib/assets/backgrounds/${background}.png`].default;

    const thumbnail = $derived.by(async () => {
        const response = await generateThumbnailFull(selectedLevel?.raw);
        return await response.blob();
    });
</script>

<div class="flex w-full flex-col">
    {#if !manipulator.isEmpty()}
        <div
            class="flex w-full flex-wrap gap-4"
            use:dndzone={{
                items: manipulator.levelpack.levels,
                flipDurationMs: 200,
                dropTargetStyle: {
                    outline: "none"
                }
            }}
            onconsider={handleDndConsiderPlaylist}
            onfinalize={handleDndFinalizePlaylist}
        >
            {#each manipulator.levelpack.levels as level, i (level.id)}
                <button animate:flip={{ duration: 200 }} class={level.tag}>
                    <ValidatedLevel
                        {level}
                        {manipulator}
                        index={i}
                        callback={(level, index) => {
                            selectedLevel = level;
                            selectedLevelIndex = index;
                        }}
                    />
                </button>
            {/each}
        </div>
    {/if}
</div>

<Dialog open={selectedLevel !== null}>
    <div class="relative">
        <button
            class="absolute top-5 right-5 z-10 cursor-pointer p-0 text-3xl font-black"
            onclick={() => (selectedLevel = null)}>X</button
        >

        {#if selectedLevel && selectedLevelIndex !== null}
            <div
                id="levelDetails"
                class="relative flex max-h-full flex-col gap-3 overflow-hidden rounded-lg p-5 text-xs text-white"
            >
                <!-- <section>
                    <div>
                        <span>{to5bLevelFormat(selectedLevelIndex + 1)}.</span>
                        <span class="font-bold">{selectedLevel.name}</span>
                    </div>
                    <br />
                    <label for="description">Description:</label>
                    <textarea
                        value={selectedLevel.description}
                        class="w-full rounded-lg bg-black/30 p-2.5"
                        name="description"
                        rows="5"
                        cols="33"
                        maxlength="1024"
                        placeholder="Level description (max 1024 chars)"
                        required
                        disabled
                    ></textarea>
                    <br />
                    <div class="mt-auto">
                        <Button
                            text="Edit this level"
                            bg="#7777ff"
                            href={`/edit/level/${selectedLevel.id}`}
                        />
                    </div>
                </section> -->
                <div class="text-2xl">
                    <span>{to5bLevelFormat(selectedLevelIndex + 1)}.</span>
                    <span class="font-bold">{selectedLevel.name}</span>
                </div>
                <div
                    class="absolute -inset-4 -z-10 bg-cover bg-center blur-xs"
                    style="background-image: url({getBackground(selectedLevel.background)});"
                    aria-hidden="true"
                ></div>
                <div class="flex flex-col items-start text-2xl">
                    <img
                        src={URL.createObjectURL(await thumbnail)}
                        alt="Level Thumbnail"
                        class="max-h-200 w-100 rounded-md object-contain"
                    />
                </div>
                <div class="flex content-between items-end gap-5 text-xl">
                    <div class="flex w-full items-end gap-5">
                        <div class="flex items-end gap-2">
                            <span class="code">{selectedLevel.width}</span>
                            <span class="text-2xl font-black">×</span>
                            <span class="code">{selectedLevel.height}</span>
                        </div>
                        <div>
                            {#if selectedLevel.levelType === "L"}
                                <span
                                    class="code bg-green-500/50! text-green-300 outline-green-500/80!"
                                    >L</span
                                >
                            {:else}
                                <span
                                    class="code bg-purple-500/50! text-purple-300 outline-purple-500/80!"
                                    >H</span
                                >
                            {/if}
                        </div>
                    </div>
                </div>
                <div>
                    <Table
                        title="Sprites ({selectedLevel.sprites.length})"
                        heads={["Sprite ID", "X", "Y", "Role ID", "Motion Speed", "Motion Path"]}
                        content={tableSprites}
                    />
                </div>
                {#if selectedLevel.dialogues.length > 0}
                    <div class="w-200">
                        <Table
                            title="Dialogues ({selectedLevel.dialogues.length})"
                            heads={["Sprite ID", "Emotion", "Text"]}
                            content={tableDialogues}
                        />
                    </div>
                {/if}
                {#if selectedLevel.logs.length > 0}
                    <div class="info">
                        <div class="rounded-sm bg-neutral-700/50 p-2.5 text-neutral-100">
                            {#each selectedLevel.logs as log}
                                <Log {log} />
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</Dialog>
