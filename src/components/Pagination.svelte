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
        page = page + by < 1 ? 1 : page + by;
        output = await callback(page, type, sort, featured);
        // console.log(page, output)
    };

    export let removeOptions = false;
    export let removeMovement = false;
</script>

{#if !removeOptions}
    <div
        class="mb-3 ml-5 *:mx-1 *:cursor-pointer *:rounded *:bg-neutral-800 *:p-2 *:text-neutral-50 *:shadow *:transition-colors *:hover:bg-neutral-700"
    >
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
{#if !removeMovement}
    <div class="p-5 text-center text-6xl font-bold text-neutral-300 select-none">
        <button
            class="cursor-pointer transition-colors hover:text-neutral-500"
            on:click={() => changePage(-1)}>{"⟵"}</button
        >
        <span class="font-mono">{page}</span>
        <button
            class="cursor-pointer transition-colors hover:text-neutral-500"
            on:click={() => changePage(1)}>{"⟶"}</button
        >
    </div>
{/if}
