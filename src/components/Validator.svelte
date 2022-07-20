<script lang="ts">
    import validate from "./client/FileValidator";
    import ValidatedLevel from "./ValidatedLevel.svelte";

    export let file: File

    const getResult = async (text: Promise<string>) => {
        const result = validate(await text)
        console.log(result)
        return result
    }
</script>

<div class="validator">
    {#if file}
        <!--{#await getResult(test)}-->
        {#await getResult(file.text())}
            <p>Validating level(s)...</p>
        {:then result}
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
        {:catch error}
            <p class="error">Error while validating level(s): {error}</p>
        {/await}
    {:else}
        <p>Waiting for file upload...</p>
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