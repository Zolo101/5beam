<script lang="ts">
    import { fly } from "svelte/transition";
    import ValidatedLevel from "./ValidatedLevel.svelte";
    import type { DetectedLevel, ValidateResult } from "../client/FileValidator";
    import Log from "./Log.svelte";
    import LevelInfo from "./LevelInfo.svelte";

    export let result: ValidateResult | undefined;
    let selectedLevel: DetectedLevel | undefined;
    $: levelDifficulties = new Array(result?.levels.length).fill(0);

    const selectLevel = (level: DetectedLevel) => {
        selectedLevel = level;
    };
</script>

<div class="flex flex-wrap justify-center gap-3">
    {#if result}
        {#each result.globalLogs as log}
            <Log {log} />
        {/each}
        {#each result.levels as level, i}
            <section>
                <button in:fly={{ y: 200, duration: 100 * i }} on:click={() => selectLevel(level)}>
                    <ValidatedLevel {level} {levelDifficulties} />
                </button>
            </section>
        {/each}
    {/if}
</div>
<LevelInfo {selectedLevel} />
