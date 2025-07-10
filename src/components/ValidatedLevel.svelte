<script lang="ts">
    import type { DetectedLevel } from "../client/FileValidator";
    import { backgrounds, to5bLevelFormat } from "../misc";
    import Difficulty from "./Difficulty.svelte";

    interface Props {
        selectedLevel: DetectedLevel | null;
        level: DetectedLevel;
        levelDifficulties: number[];
    }

    let { level, selectedLevel = $bindable(), levelDifficulties = $bindable() }: Props = $props();
    let openDifficulties = $state(false);

    // TODO: Find a better way to get the log level of a validation
    const warningLog = level.logs.find((l) => l.level === "warning") !== undefined;
    const errorLog = level.logs.find((l) => l.level === "error") !== undefined;

    const getBackground = (background: number) =>
        backgrounds[`/src/lib/assets/backgrounds/${background}.png`].default;

    const difficultyIndex = level.id - 1;
</script>

<div
    class="h-[128px] w-[128px] rounded-lg bg-cover shadow-xl hover:shadow-2xl hover:outline-4 hover:outline-white/10"
    class:warningLog
    class:errorLog
    style="background-image: url({getBackground(level.background)});"
    onpointerleave={() => (openDifficulties = false)}
>
    <span class="relative top-9 text-4xl font-bold text-white select-none"
        >{to5bLevelFormat(level.id)}</span
    >
    <div class="relative top-13 w-[35px]" onpointerover={() => (openDifficulties = true)}>
        <Difficulty difficulty={levelDifficulties[difficultyIndex]} />
    </div>
    <button
        class="relative top-5 left-6 cursor-pointer rounded bg-neutral-600 px-3 py-1 text-xs hover:bg-neutral-500"
        onclick={() => (selectedLevel = level)}>Inspect</button
    >

    {#if openDifficulties}
        <div
            class="relative bottom-[100px] z-10 inline-grid h-[90px] w-[128px] grid-cols-3 justify-items-center rounded bg-black/50 p-1"
        >
            {#each [1, 2, 3, 4, 5, 6] as j}
                <button
                    class="cursor-pointer transition hover:scale-110 hover:bg-white/20"
                    onclick={() => (levelDifficulties[difficultyIndex] = j)}
                >
                    <Difficulty difficulty={j} />
                </button>
            {/each}
        </div>
    {/if}
</div>
