<script lang="ts">
    export let title: string = "";
    export let heads: string[] = [];
    export let content: [string, ...any][];
    export let dynamicWidth: boolean = true;
</script>

<table class:dynamicWidth>
    {#if title}
        <caption>{title}</caption>
    {/if}
    {#if heads}
        <thead>
            <tr>
                {#each heads as head}
                    <th>{head}</th>
                {/each}
            </tr>
        </thead>
    {/if}
    <tbody>
        {#each content as row}
            <tr>
                {#each row as item}
                    <td>{item}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        @apply rounded border-hidden text-neutral-200 outline outline-4 outline-black;
        background: repeating-linear-gradient(
            -45deg,
            #5a5a5a,
            #5a5a5a 10px,
            #464646 10px,
            #464646 20px
        );
        /*border: 1px solid black;*/
    }

    caption {
        @apply bg-black p-1 text-sm;
        /*background-color: black;*/
        /*padding: 5px;*/
    }

    th,
    td {
        @apply border-2 border-neutral-800 p-2.5;
    }

    th {
        @apply bg-neutral-700;
        /*background-color: #5a5a5a;*/
    }

    td {
        background-color: #5a5a5a;
    }

    .dynamicWidth {
        width: 100%;
    }
</style>
