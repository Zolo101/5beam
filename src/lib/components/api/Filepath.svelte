<script lang="ts">
    interface Props {
        directory: string[];
        oppositeSlash?: boolean;
    }

    let { directory, oppositeSlash = false }: Props = $props();

    const slash = oppositeSlash ? "\\" : "/";
</script>

<div class="filepath">
    {#each directory as folder, i}
        {#if i > 0}
            <span class="h-9 px-2 text-3xl font-bold text-neutral-500">{slash}</span>
        {/if}
        <span class="filepath-folder text-neutral-200">{folder}</span>
    {/each}
</div>

<style>
    .filepath {
        display: inline-flex;
        align-items: center;
    }
</style>
