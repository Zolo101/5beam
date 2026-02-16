<script lang="ts">
    interface Props {
        directory: string[];
        oppositeSlash?: boolean;
    }

    let { directory, oppositeSlash = false }: Props = $props();

    const slash = $derived(oppositeSlash ? "\\" : "/");
</script>

<div class="filepath">
    {#each directory as folder, i}
        {#if i > 0}
            <span class="h-9 px-2 text-3xl font-bold text-white mix-blend-overlay">{slash}</span>
        {/if}
        <span class="filepath-folder text-neutral-100">{folder}</span>
    {/each}
</div>

<style>
    .filepath {
        display: inline-flex;
        align-items: center;
    }
</style>
