<script lang="ts">
    import type { DetectedLevel } from "$lib/client/FileValidator";
    import type LevelpackManipulator from "$lib/client/LevelpackManipulator.svelte";
    import { backgrounds, to5bLevelFormat } from "$lib/misc";
    import Difficulty from "./Difficulty.svelte";

    interface Props {
        manipulator: LevelpackManipulator;
        level: DetectedLevel;
        index: number;
        callback: (level: DetectedLevel, index: number) => void;
    }

    let { manipulator, level, index, callback }: Props = $props();
    let openDifficulties = $state(false);

    // TODO: Find a better way to get the log level of a validation
    const warningLog = $derived(level.logs.find((l) => l.level === "warning") !== undefined);
    const errorLog = $derived(level.logs.find((l) => l.level === "error") !== undefined);

    const getBackground = (background: number) =>
        backgrounds[`/src/lib/assets/backgrounds/${background}.png`].default;

    function changeDifficulty(difficulty: number) {
        manipulator.editLevel(level, { difficulty });
    }

    let showOptions = $state(false);
</script>

<div
    class="relative h-[128px] w-[128px] rounded-lg bg-cover outline-4 outline-transparent transition-colors hover:outline-zinc-700"
    class:warningLog
    class:errorLog
    style="background-image: url({getBackground(level.background)});"
    onpointerenter={() => (showOptions = true)}
    onpointerleave={() => ((openDifficulties = false), (showOptions = false))}
>
    <span class="index absolute right-1 bottom-0 text-3xl font-bold text-white select-none"
        >{to5bLevelFormat(index + 1)}</span
    >
    <span
        class="absolute flex h-full w-full items-center justify-center text-sm font-bold text-white select-none"
        >{level.name}</span
    >
    <div
        class="absolute bottom-1 left-1 w-[35px]"
        onpointerenter={() => ((openDifficulties = true), (showOptions = false))}
    >
        <Difficulty difficulty={level.difficulty} />
    </div>
    {#if showOptions}
        <button
            class="absolute top-2 right-2 cursor-pointer rounded bg-black px-2 text-sm font-black text-red-600"
            onclick={() => manipulator.removeLevel(level)}>X</button
        >
        <button
            class="absolute top-2 left-2 cursor-pointer rounded bg-black px-2 text-sm font-black text-blue-600"
            onclick={() => callback(level, index)}>?</button
        >
    {/if}

    {#if openDifficulties}
        <div
            class="absolute top-0 left-0 z-10 inline-grid h-[85px] w-full grid-cols-3 justify-items-center rounded-t bg-zinc-700 p-1"
        >
            {#each [1, 2, 3, 4, 5, 6] as j}
                <button
                    class="cursor-pointer transition hover:scale-110 hover:bg-white/20"
                    onclick={() => changeDifficulty(j)}
                >
                    <Difficulty difficulty={j} />
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    :global(#dnd-action-dragged-el) .index {
        opacity: 0;
    }
</style>
