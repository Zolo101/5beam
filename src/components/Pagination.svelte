<script lang="ts">
    export let page = 1;
    export let callback: (page: number, ...parameters: number[]) => Promise<unknown>;

    // Output variable to bind to
    export let output: unknown;

    // (Usually) server-side data, which would be replaced upon page change
    export const input: unknown = output;

    export let type: number = 0;
    export let featured: number = 0;
    export let sort: number = 0;

    const changePage = async (by: number) => {
        // dont go below zero
        page = (page + by < 1 ? 1 : page + by);
        output = await callback(page, type, sort, featured);
        // console.log(page, output)
    }
    export let removeOptions = false;
</script>

{#if !removeOptions}
    <div class="ml-5 mb-3">
        <select name="filter" bind:value={featured}>
            <option value={1}>Featured</option>
            <option value={0}>All</option>
        </select>
        <select name="sort" bind:value={sort}>
            <option value={0}>Newest</option>
            <option value={1}>Oldest</option>
            <option value={2}>Most Popular</option>
        </select>
    </div>
{/if}
<slot></slot>
<div class="text-center text-6xl p-5 text-neutral-300 select-none">
    <span class="font-bold cursor-pointer hover:text-neutral-500 transition-colors" on:click={() => changePage(-1)}>{"⟵"}</span>
    <span class="font-bold font-mono">{page}</span>
    <span class="font-bold cursor-pointer hover:text-neutral-500 transition-colors" on:click={() => changePage(1)}>{"⟶"}</span>
</div>

<style>
    select {
        @apply text-neutral-50 bg-neutral-800 rounded cursor-pointer shadow transition-colors p-2 mx-1;
    }

    select:hover {
        @apply bg-neutral-700;
    }
</style>