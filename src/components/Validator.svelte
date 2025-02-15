<script lang="ts">
    import { fly } from "svelte/transition";
    import ValidatedLevel from "./ValidatedLevel.svelte";
    import type { DetectedLevel, ValidateResult } from "../client/FileValidator";
    import Log from "./Log.svelte";
    import { to5bLevelFormat } from "../misc";
    import Table from "./layout/Table.svelte";
    // import { difficultyMap } from "../misc";
    import Difficulty from "./Difficulty.svelte";
    // import SpriteViewer from "./viewer/SpriteViewer.svelte";

    // let dialog = document.querySelector<HTMLDivElement>("#levelDetails")
    export let result: ValidateResult | undefined;
    let selectedLevel: DetectedLevel | undefined;
    let selectableDifficulties = [0, 1, 2, 3, 4, 5, 6];
    $: levelDifficulties = new Array(result?.levels.length).fill(0);
    $: selectedDifficulties = new Array(result?.levels.length).fill(false);

    $: tableSprites = selectedLevel?.sprites.map((s) =>
        Object.values(s).filter((v) => v !== undefined)
    );

    $: tableDialogues = selectedLevel?.dialogues.map((d) => Object.values(d));

    // TODO: Find a better way to get the log level of a validation
    $: warningLog = selectedLevel?.logs.find((l) => l.level === "warning") !== undefined;
    $: errorLog = selectedLevel?.logs.find((l) => l.level === "error") !== undefined;
    const stickDetails = () => {
        try {
            document.querySelector<HTMLDivElement>("#levelDetails").style.top =
                `${window.scrollY}px`;
        } catch {}
    };

    const selectLevel = (level: DetectedLevel) => {
        selectedLevel = level;
        stickDetails();
    };

    // window.addEventListener("scroll", stickDetails)
</script>

<div class="flex flex-wrap justify-center gap-3">
    {#if result}
        {#if result.globalLogs.length > 0}
            <div class="p-2.5 text-neutral-200">
                {#each result.globalLogs as log}
                    <Log {log} />
                {/each}
            </div>
        {/if}
        {#each result.levels as level, i}
            <div>
                <div on:click={() => selectLevel(level)}>
                    <ValidatedLevel {level} {i} />
                </div>
                <!--                <div on:click={() => selectedDifficulties[i] = !selectedDifficulties[i]} class="relative w-[35px] h-[0px] left-[90px] bottom-[40px] hover:bg-white/20 rounded cursor-pointer transition hover:scale-110">-->
                <!--                    <Difficulty difficulty={levelDifficulties[i]}/>-->
                <!--                </div>-->
            </div>
            <!--{#if !selectedDifficulties[i]}-->
            {#if false}
                <div class="flex w-full rounded-[10px] bg-black/50 shadow-2xl">
                    <div class="m-auto p-2 text-center">
                        <span class="rounded bg-red-600 p-1 text-xl font-black">BETA</span>
                        <span class="text-center text-xl font-bold"
                            >Select a difficulty for
                        </span><span class="text-xl">{to5bLevelFormat(i + 1)}</span>
                        <p>
                            Check out this page if your unsure on what difficulty your level should
                            be!
                        </p>
                    </div>
                    <div class="inline-grid w-3/4 grid-cols-3 justify-items-center p-5">
                        {#each [0, 1, 2, 3, 4, 5, 6] as j}
                            <div
                                class="cursor-pointer rounded p-1 transition hover:scale-110 hover:bg-white/20"
                                on:click={() => (levelDifficulties[i] = j)}
                            >
                                <Difficulty difficulty={j} />
                            </div>
                        {/each}
                    </div>
                </div>
            {/if}
        {/each}
    {/if}
</div>

{#if selectedLevel}
    <!-- TODO: Figure out how to scroll down this validator since you cant see the full details on level 46. -->
    <div
        transition:fly={{ x: -100 }}
        id="levelDetails"
        class="absolute left-0 top-0 z-10 w-1/2 rounded-br-xl bg-green-950/80 p-5 shadow-2xl backdrop-blur-md"
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
                        <span class="code !bg-green-500/50 text-green-300 !outline-green-500/80"
                            >L</span
                        >
                    {:else}
                        <span class="code !bg-purple-500/50 text-purple-300 !outline-purple-500/80"
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
                <div class="rounded bg-neutral-700 bg-opacity-50 p-2.5 text-neutral-200">
                    {#each selectedLevel.logs as log}
                        <Log {log} />
                    {/each}
                </div>
            {/if}
        </div>
    </div>
{/if}

<style>
    .code {
        @apply rounded bg-white/20 px-2 font-black shadow outline outline-2 outline-white/50;
    }

    .warningLog {
        @apply shadow-amber-900 outline outline-4 outline-amber-500;
    }

    .errorLog {
        @apply shadow-red-900 outline outline-4 outline-red-500;
    }

    .level-props {
        text-align: center;
    }

    .sprites,
    .dialogues {
        padding: 10px;
    }
</style>
