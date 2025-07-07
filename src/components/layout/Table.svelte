<script lang="ts">
    interface Props {
        title?: string;
        heads?: string[];
        content: [string, ...any][];
        dynamicWidth?: boolean;
    }

    let {
        title = "",
        heads = [],
        content,
        dynamicWidth = true
    }: Props = $props();
</script>

<table class:dynamicWidth class="mt-5">
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
