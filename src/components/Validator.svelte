<script lang="ts">
    import ValidatedLevel from "./ValidatedLevel.svelte";

    export let result;
</script>

<div class="validator">
    {#if result}
        {#if result.errors.length > 0}
            <div class="info">
                <h2>Validation Errors:</h2>
                {#each result.errors as error}
                    <p class="error">{error}</p>
                {/each}
            </div>
        {/if}
        {#each result.levels as level, i}
            <ValidatedLevel {level} {i}/>
        {/each}
    {/if}
</div>

<style>
    .info {
        background-color: #3a3a3a;
        color: whitesmoke;
        padding: 10px;
    }

    .error {
        color: orangered;
        font-weight: bold;
    }
</style>