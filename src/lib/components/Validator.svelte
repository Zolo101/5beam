<script lang="ts">
    import ValidatedLevel from "./ValidatedLevel.svelte";
    import type { DetectedLevel, ValidateResult } from "$lib/client/FileValidator";
    import Log from "./Log.svelte";
    import LevelInfo from "./LevelInfo.svelte";
    import Dialog from "./Dialog.svelte";

    interface Props {
        result: ValidateResult | undefined;
        defaultDifficulties?: number[];
        difficulties: number[];
    }

    let { result, defaultDifficulties, difficulties = $bindable() }: Props = $props();
    let selectedLevel: DetectedLevel | null = $state(null);

    if (defaultDifficulties) {
        difficulties = defaultDifficulties;
    } else if (result && difficulties.length === 0) {
        difficulties = new Array(200).fill(0);
    }
</script>

<div class="flex flex-col gap-3">
    {#if result}
        {#each result.globalLogs as log}
            <Log {log} />
        {/each}
        <div class="flex flex-wrap justify-center gap-3">
            {#each result.levels as level}
                <button>
                    <ValidatedLevel
                        bind:selectedLevel
                        {level}
                        bind:levelDifficulties={difficulties}
                    />
                </button>
            {/each}
        </div>
    {/if}
</div>
<Dialog open={selectedLevel !== null}>
    <LevelInfo bind:selectedLevel />
</Dialog>
