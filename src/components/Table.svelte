<script lang="ts">
    export let title: string = "";
    export let heads: string[] = [];
    export let content: [string, any][]
    export let dynamicWidth: boolean = true
</script>

<table class:dynamicWidth={dynamicWidth}>
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
        background: repeating-linear-gradient(-45deg, #5a5a5a, #5a5a5a 10px, #464646 10px, #464646 20px);;
        border-collapse: collapse;
        border: 1px solid black;
        color: gainsboro;
    }

    caption {
        background-color: black;
        padding: 5px;
    }

    th, td {
        padding: 10px;
    }

    th {
        background-color: #5a5a5a;
        border: 1px solid black;
    }

    td {
        background-color: #5a5a5a;
        border: 1px solid black;
    }

    .dynamicWidth {
        width: 100%;
    }
</style>