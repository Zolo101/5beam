<script lang="ts">
    import { fly } from "svelte/transition";
    import type { DetectedLevel } from "../client/FileValidator";
    import { backgrounds, to5bLevelFormat } from "../misc";
    import Table from "./layout/Table.svelte";
    import Log from "./Log.svelte";

    interface Props {
        selectedLevel: DetectedLevel | null;
    }

    let { selectedLevel = $bindable() }: Props = $props();

    let tableSprites = $derived(
        selectedLevel?.sprites.map((s) => Object.values(s).filter((v) => v !== undefined))
    );

    let tableDialogues = $derived(selectedLevel?.dialogues.map((d) => Object.values(d)));

    // TODO: This is a duplicate of the ValidatedLevel.svelte function
    const getBackground = (background: number) =>
        backgrounds[`/src/lib/assets/backgrounds/${background}.png`].default;
</script>

{#if selectedLevel}
    <div
        id="levelDetails"
        class="relative flex max-h-screen flex-col gap-3 overflow-hidden rounded-lg p-5"
    >
        <div
            class="absolute -inset-4 -z-10 bg-cover bg-center blur-xs"
            style="background-image: url({getBackground(selectedLevel.background)});"
            aria-hidden="true"
        ></div>
        <div class="flex items-start justify-between text-5xl">
            <div class="text-white">
                <span>{to5bLevelFormat(selectedLevel.id)}.</span>
                <span class="font-bold">{selectedLevel.name}</span>
            </div>
            <button
                class="rounded bg-green-600 px-3 py-1 text-4xl hover:bg-green-500"
                onclick={() => (selectedLevel = null)}>OK</button
            >
            <!-- <div>
                <button class="p-0 text-3xl" onclick={() => (selectedLevel = undefined)}>✕</button>
            </div> -->
        </div>
        <div class="flex content-between items-end gap-5 text-3xl">
            <div class="flex w-full items-end gap-5">
                <div class="flex items-end gap-2">
                    <span class="code">{selectedLevel.width}</span>
                    <span class="text-5xl font-black">×</span>
                    <span class="code">{selectedLevel.height}</span>
                </div>
                <div>
                    {#if selectedLevel.levelType === "L"}
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
                title="Sprites ({selectedLevel.sprites.length})"
                heads={["Sprite ID", "X", "Y", "Role ID", "Motion Speed", "Motion Path"]}
                content={tableSprites}
            />
        </div>
        {#if selectedLevel.dialogues.length > 0}
            <div>
                <Table
                    title="Dialogues ({selectedLevel.dialogues.length})"
                    heads={["Sprite ID", "Emotion", "Text"]}
                    content={tableDialogues}
                />
            </div>
        {/if}
        {#if selectedLevel.logs.length > 0}
            <div class="info">
                <div class="rounded-sm bg-neutral-700/50 p-2.5 text-neutral-200">
                    {#each selectedLevel.logs as log}
                        <Log {log} />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}
