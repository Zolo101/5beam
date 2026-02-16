<script lang="ts">
    import type { RemoteQueryFunction } from "@sveltejs/kit";
    import type { Component } from "svelte";

    type PaginationObject = {
        page: number;
        type: number;
        sortCode: number;
        featured: boolean;
        amount: number;
        mod: string;
        text?: string;
        id?: string;
        areaCode: number;
        characters: string[];
        options?: Record<string, unknown>;
    };

    interface Props<T> {
        page?: number;
        query: RemoteQueryFunction<PaginationObject, T[]>;
        // Output variable to bind to
        // output: T[] | null;
        columns?: number;
        type?: number;
        amount?: number;
        featured?: boolean;
        sort?: number;
        mod?: string;
        text?: string;
        id?: string;
        areaCode?: number;
        characters?: string[];
        removeOptions?: boolean;
        removeMovement?: boolean;
        // TODO: 'any' alternative?
        PageComponent?: Component<any, {}, any>;
    }

    let {
        query,
        // output = $bindable(),
        columns = 2,
        type = 0,
        amount = 12,
        featured: defaultFeatured = false,
        sort: defaultSortCode = 0,
        mod = "",
        text = "",
        id = "",
        areaCode = 0,
        characters = [],
        removeOptions = false,
        removeMovement = false,
        PageComponent
    }: Props<unknown> = $props();

    let page = $state(1);
    let featured = $derived(defaultFeatured);
    let sortCode = $derived(defaultSortCode);

    let windowWidth = $state(0);

    let internalText = $state(text);

    let output = $derived(
        await query({
            page,
            type,
            sortCode,
            featured,
            amount,
            mod,
            areaCode,
            characters,
            text: internalText,
            id,
            options: { requestKey: null }
        })
    );

    const resetPage = () => (page = 1);

    // Must always be amount length
    const viewOutput = $derived.by(() => {
        // console.log(output[0]);
        const arr = output?.slice(0, amount) ?? [];
        while (arr.length < amount) arr.push(null);
        return arr;
    });

    $effect(() => {
        if (internalText !== text) {
            internalText = text;
            page = 1;
        }
    });
</script>

{#if !removeOptions}
    <div
        data-nosnippet
        class="mb-5 flex justify-center gap-3 [&_select]:cursor-pointer [&_select]:rounded [&_select]:bg-neutral-800 [&_select]:p-2 [&_select]:transition-colors [&_select]:hover:bg-neutral-700"
    >
        <select name="filter" bind:value={featured} onchange={resetPage}>
            <option value={false}>All</option>
            <option value={true}>Featured</option>
        </select>
        <select name="sort" bind:value={sortCode} onchange={resetPage}>
            <option value={0}>Newest</option>
            <option value={1}>Oldest</option>
            <option value={2}>Most plays</option>
            <option value={3}>Most stars</option>
        </select>
    </div>
{/if}
<div
    class="m-auto flex flex-wrap justify-center gap-4"
    bind:clientWidth={windowWidth}
    style="grid-template-columns: repeat({Math.floor(amount / columns)}, minmax(350px, 1fr));"
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
            onclick={() => (page = Math.max(1, page - 1))}>{"⟵"}</button
        >
        <span class="font-mono">{page}</span>
        <button
            class="cursor-pointer transition-colors hover:text-neutral-500"
            onclick={() => (page += 1)}>{"⟶"}</button
        >
    </div>
{/if}
