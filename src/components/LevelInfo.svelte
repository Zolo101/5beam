<script lang="ts">
    import { fly } from "svelte/transition";
    import type { DetectedLevel } from "../client/FileValidator";
    import { to5bLevelFormat } from "../misc";
    import Table from "./layout/Table.svelte";
    import Log from "./Log.svelte";

    export let selectedLevel: DetectedLevel | undefined;

    $: tableSprites = selectedLevel?.sprites.map((s) =>
        Object.values(s).filter((v) => v !== undefined)
    );

    $: tableDialogues = selectedLevel?.dialogues.map((d) => Object.values(d));
</script>

{#if selectedLevel}
    <div
        transition:fly={{ x: -100 }}
        id="levelDetails"
        class=" z-10 w-1/2 rounded-br-xl bg-green-950/80 p-5 shadow-2xl backdrop-blur-md"
    >
        <div class="flex items-start justify-between text-7xl">
            <div>
                <span>{to5bLevelFormat(selectedLevel.id)}.</span>
                <span class="font-bold">{selectedLevel.name}</span>
            </div>
            <div>
                <button class="p-0 text-7xl" on:click={() => (selectedLevel = undefined)}>✕</button>
            </div>
        </div>
        <div class="flex content-between items-end gap-5 text-4xl">
            <div class="flex w-full items-end gap-5 text-4xl">
                <div class="flex items-end gap-2 px-2 pt-4">
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
            <!--            <div class="flex items-center gap-2 code text-xl" style="background: {difficultyColorMap.get(0)}; outline-colour: {difficultyColorMap.get(0)}">-->
            <!--                <Difficulty difficulty={0}/>-->
            <!--                <span>{difficultyMap.get(0)}</span>-->
            <!--            </div>-->
        </div>
        <div class="px-2 pt-8">
            <!--                        <h2>Sprites</h2>-->
            <Table
                title="Sprites ({selectedLevel.sprites.length})"
                heads={["Sprite ID", "X", "Y", "Role ID", "Motion Speed", "Motion Path"]}
                content={tableSprites}
            />
            <!--            <SpriteViewer sprites={selectedLevel.sprites}/>-->
        </div>
        {#if selectedLevel.dialogues.length > 0}
            <div class="px-2 pt-8">
                <!--                        <h2>Dialogues</h2>-->
                <Table
                    title="Dialogues ({selectedLevel.dialogues.length})"
                    heads={["Sprite ID", "Emotion", "Text"]}
                    content={tableDialogues}
                />
            </div>
        {/if}
        <div class="info">
            {#if selectedLevel.logs.length > 0}
                <div class="rounded-sm bg-neutral-700/50 p-2.5 text-neutral-200">
                    {#each selectedLevel.logs as log}
                        <Log {log} />
                    {/each}
                </div>
            {/if}
        </div>
    </div>
{/if}
