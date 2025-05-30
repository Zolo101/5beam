<script lang="ts">
    import type { DetectedLevel } from "../client/FileValidator";
    import { backgrounds, to5bLevelFormat } from "../misc";
    import Difficulty from "./Difficulty.svelte";

    export let level: DetectedLevel;
    export let levelDifficulties: number[];
    $: opened = false;

    // TODO: Find a better way to get the log level of a validation
    const warningLog = level.logs.find((l) => l.level === "warning") !== undefined;
    const errorLog = level.logs.find((l) => l.level === "error") !== undefined;

    const getBackground = (background: number) =>
        backgrounds[`/src/lib/assets/backgrounds/${background}.png`];
</script>

<!--    TODO: Is the "button" role appropriate for this? -->
<button
    class="
    h-[128px] w-[128px] transform cursor-pointer rounded-[10px] bg-cover shadow-xl
    duration-200 ease-in-out select-none hover:scale-105 hover:shadow-2xl hover:outline hover:outline-4 hover:outline-white/10
"
    class:warningLog
    class:errorLog
    style="background-image: url({getBackground(level.background)});"
    on:click={() => (opened = !opened)}
>
    <span
        class="absolute right-0 bottom-0 z-0 px-1.5 text-4xl font-bold text-white mix-blend-overlay select-none"
        >{to5bLevelFormat(level.id)}</span
    >
    <div class="absolute bottom-0 z-10 w-[35px]">
        <Difficulty difficulty={levelDifficulties[level.id]} />
    </div>
</button>
{#if opened}
    <div class="flex w-full rounded-[10px] bg-black/50 shadow-2xl">
        <div class="m-auto p-2 text-center">
            <!-- <span class="rounded-sm bg-red-600 p-1 text-xl font-black">BETA</span> -->
            <span class="text-center text-xl font-bold">Select a difficulty for </span><span
                class="text-xl">{to5bLevelFormat(level.id)}</span
            >
            <!-- <p>
                    Check out this page if your unsure on what difficulty your level should be!
                </p> -->
        </div>
        <div class="inline-grid w-3/4 grid-cols-3 justify-items-center p-5">
            {#each [1, 2, 3, 4, 5, 6] as j}
                <button
                    class="cursor-pointer rounded-sm p-1 transition hover:scale-110 hover:bg-white/20"
                    on:click={() => (levelDifficulties[level.id] = j)}
                >
                    <Difficulty difficulty={j} />
                </button>
            {/each}
        </div>
    </div>
{/if}
