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
