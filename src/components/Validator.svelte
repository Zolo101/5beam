<script lang="ts">
    import ValidatedLevel from "./ValidatedLevel.svelte";
    import type { ValidateResult } from "../client/FileValidator";
    import Log from "./Log.svelte";

    export let result: ValidateResult | undefined
</script>

<div class="flex flex-wrap justify-center gap-3">
    {#if result}
        {#if result.globalLogs.length > 0}
            <div class="text-neutral-200 p-2.5">
                {#each result.globalLogs as log}
                    <Log {log}/>
                {/each}
            </div>
        {/if}
        {#each result.levels as level, i}
            <ValidatedLevel {level} {i}/>
        {/each}
    {/if}
</div>