<script lang="ts">
    interface Props {
        title?: string;
        heads?: string[];
        content: [string, ...any][];
        dynamicWidth?: boolean;
    }

    let { title = "", heads = [], content, dynamicWidth = true }: Props = $props();
</script>

<table
    class:dynamicWidth
    class="mt-5 rounded border-hidden text-neutral-200 outline-4 outline-black"
>
    {#if title}
        <caption class="bg-black p-1 text-sm">{title}</caption>
    {/if}
    {#if heads}
        <thead>
            <tr class="bg-neutral-700">
                {#each heads as head}
                    <th class="border-2 border-neutral-800 bg-neutral-700 p-2.5">{head}</th>
                {/each}
            </tr>
        </thead>
    {/if}
    <tbody>
        {#each content as row}
            <tr>
                {#each row as item}
                    <td class="border-2 border-neutral-800 bg-neutral-600 p-2.5">{item}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    table {
        background: repeating-linear-gradient(
            -45deg,
            #5a5a5a,
            #5a5a5a 10px,
            #464646 10px,
            #464646 20px
        );
    }

    .dynamicWidth {
        width: 100%;
    }
</style>
