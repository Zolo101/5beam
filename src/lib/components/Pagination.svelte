<script lang="ts">
    import { clamp } from "$lib/misc";
    import type { Component } from "svelte";

    type PaginationObject = {
        page: number;
        type: number;
        sort: number;
        featured: boolean;
        amount: number;
    };

    const changePage = async (by: number) => {
        // dont go below zero
        if (page + by < 1) return;

        const newOutput = await callback({ page: page + by, type, sort, featured, amount });

        if (newOutput && newOutput.length > 0) {
            page += by;
            output = newOutput;
        }
    };

    const updateFilters = async () => {
        // Reset to page 1 and fetch new data when filter/sort changes
        page = 1;

        const newOutput = await callback({ page, type, sort, featured, amount });
        if (newOutput) {
            output = newOutput;
        }
    };

    const resetPage = () => (page = 1);

    interface Props<T> {
        page?: number;
        callback: (pagination: PaginationObject) => Promise<T[] | null>;
        // Output variable to bind to
        output: T[] | null;
        columns?: number;
        type?: number;
        featured?: boolean;
        sort?: number;
        removeOptions?: boolean;
        removeMovement?: boolean;
        PageComponent?: Component;
    }

    let {
        page = $bindable(1),
        callback,
        output = $bindable(),
        columns = 2,
        type = 0,
        featured = $bindable(false),
        sort = $bindable(0),
        removeOptions = false,
        removeMovement = false,
        PageComponent
    }: Props<unknown> = $props();

    let windowWidth = $state(0);
    let amount = $derived(clamp(columns * Math.floor((windowWidth - 512) / 256), 1, 8));

    // Run updateFilters when amount changes
    // TODO: Bug where if you to go page 4 on small screens then resize, you can get softlocked
    $effect(() => {
        if (amount > 0) {
            callback({ page, type, sort, featured, amount }).then((newOutput) => {
                if (newOutput) {
                    output = newOutput;
                }
            });
        }
    });

    // Must always be amount length
    const viewOutput = $derived.by(() => {
        // console.log(output[0]);
        const arr = output?.slice(0, amount) ?? [];
        while (arr.length < amount) arr.push(null);
        return arr;
    });
</script>

<svelte:window bind:innerWidth={windowWidth} />

{#if !removeOptions}
    <div
        data-nosnippet
        class="mb-3 ml-5 *:mx-1 *:cursor-pointer *:rounded *:bg-neutral-800 *:p-2 *:text-neutral-50 *:shadow *:transition-colors *:hover:bg-neutral-700"
    >
        <select name="filter" bind:value={featured} onchange={resetPage}>
            <option value={false}>All</option>
            <option value={true}>Featured</option>
        </select>
        <select name="sort" bind:value={sort} onchange={resetPage}>
            <option value={0}>Newest</option>
            <option value={1}>Oldest</option>
            <option value={2}>Most Popular</option>
        </select>
    </div>
{/if}
<div
    class="m-auto flex flex-wrap justify-center gap-4"
    style="grid-template-columns: repeat({Math.floor(amount / columns)}, minmax(0, 1fr));"
>
    {#if viewOutput}
        {#each viewOutput as data}
            <PageComponent {data} />
        {/each}
    {/if}
</div>
{#if !removeMovement}
    <div class="p-5 text-center text-6xl font-bold text-neutral-300 select-none">
        <button
            class="cursor-pointer transition-colors hover:text-neutral-500"
            onclick={() => changePage(-1)}>{"⟵"}</button
        >
        <span class="font-mono">{page}</span>
        <button
            class="cursor-pointer transition-colors hover:text-neutral-500"
            onclick={() => changePage(1)}>{"⟶"}</button
        >
    </div>
{/if}
