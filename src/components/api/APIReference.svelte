<script lang="ts">
    import Filepath from "./Filepath.svelte";

    export let type: "GET" | "POST" | "STRUCT" | string = "OTHER"
    export let reference: string | string[];
</script>

<div class="reference">
    <span class="type colour-{type}">{type}</span>
    <span class="text">
        {#if Array.isArray(reference)}
            <Filepath directory={reference}/>
        {:else}
            {reference}
        {/if}
    </span>
</div>

<style>
    .reference {
        display: inline;
        background-color: black;
        font-weight: bold;
        padding: 5px;
    }

    .colour-GET {
        color: lawngreen;
    }

    .colour-POST {
        color: hotpink;
    }

    .colour-STRUCT {
        color: deepskyblue;
    }

    .colour-OTHER {
        color: lightslategrey;
    }
</style>