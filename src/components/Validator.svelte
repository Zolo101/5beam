<script lang="ts">
    import { fly } from "svelte/transition";
    import ValidatedLevel from "./ValidatedLevel.svelte";
    import type { DetectedLevel, ValidateResult } from "../client/FileValidator";
    import Log from "./Log.svelte";
    import LevelInfo from "./LevelInfo.svelte";
    import Dialog from "./Dialog.svelte";

    interface Props {
        result: ValidateResult | undefined;
    }

    let { result }: Props = $props();
    let selectedLevel: DetectedLevel | null = $state(null);
    let levelDifficulties = $state(new Array(result?.levels.length).fill(0));
</script>

<div class="flex flex-wrap justify-center gap-3">
    {#if result}
        {#each result.globalLogs as log}
            <Log {log} />
        {/each}
        {#each result.levels as level, i}
            <section>
                <button in:fly={{ y: 200, duration: 100 * i }}>
                    <ValidatedLevel bind:selectedLevel {level} bind:levelDifficulties />
                </button>
            </section>
        {/each}
    {/if}
</div>
<Dialog open={selectedLevel !== null}>
    <LevelInfo bind:selectedLevel />
</Dialog>
