<script lang="ts">
    import Filepath from "./Filepath.svelte";

    interface Props {
        type?: "GET" | "POST" | "STRUCT" | string;
        reference: string | string[];
    }

    let { type = "OTHER", reference }: Props = $props();
</script>

<div class="reference">
    <span class="type colour-{type}">{type}</span>
    <span class="text">
        {#if Array.isArray(reference)}
            <Filepath directory={reference} />
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

    .text {
        padding: 0 5px;
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

    .colour-DISCORD {
        color: #5865f2;
    }

    .colour-OTHER {
        color: lightslategrey;
    }
</style>
