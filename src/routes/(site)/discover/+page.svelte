<script lang="ts">
    import type { PageData } from "./$types";
    import Pagination from "$lib/components/Pagination.svelte";
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import { getLevelpackSearch, getLevelSearch } from "$lib/get.remote";

    import Boards from "$lib/assets/icons/Boards.svg?component";
    import Lists from "$lib/assets/icons/Lists.svg?component";
    import LevelListComponent from "$lib/components/browse/LevelListComponent.svelte";

    let { data }: { data: PageData } = $props();

    // let description = $state("");
    let type = $state(0);
    let modded = $state("");
    let featured = $state(false);
    let sortCode = $state(0);

    let searchText = $state("");

    let boardType = $state(0);
    let PageComponent = $derived.by(() => {
        if (boardType === 0) {
            // Board
            return type ? LevelpackComponent : LevelComponent;
        } else {
            // List
            // TODO: Make LevelpackListComponent
            return type ? LevelpackComponent : LevelListComponent;
        }
    });

    // https://en.wikipedia.org/wiki/Highly_composite_number
    let amount = $derived(boardType ? 36 : 12);
</script>

<!-- "Changes may not be saved" -->
<svelte:window onbeforeunload={() => true} />

<section class="full-width flex">
    <div
        class="flex min-w-64 flex-col gap-1 rounded-l-xl bg-zinc-800 p-5 text-xl shadow-lg [&_label]:pt-6 [&_label]:font-bold"
    >
        <p class="text-center">Filters</p>
        <!-- <br /> -->
        <!-- <label for="description">Description:</label>
        <textarea
            bind:value={description}
            class="w-full rounded-lg bg-black/30 p-2.5"
            name="description"
            rows="5"
            cols="33"
            maxlength="1024"
            placeholder="Playlist description (max 1024 chars)"
            required
        ></textarea> -->
        <label for="type">Type</label>
        <select bind:value={type} name="type" class="rounded-lg bg-black/30 p-2.5">
            <option value={0}>Level</option>
            <option value={1}>Levelpack</option>
        </select>
        <label for="sort">Sort by</label>
        <select bind:value={sortCode} name="sort" class="rounded-lg bg-black/30 p-2.5">
            <option value={0}>Newest</option>
            <option value={1}>Oldest</option>
            <option value={2}>Most plays</option>
            <option value={3}>Most stars</option>
        </select>
        <label for="featured">Featured</label>
        <input type="checkbox" class="h-8" name="featured" bind:checked={featured} />
        <label for="modded">Mod</label>
        <select bind:value={modded} name="modded" class="rounded-lg bg-black/30 p-2.5">
            <option value={""}>5b</option>
            <option value={"golden5"}>Golden 5</option>
            <option value={"5*"}>5*30</option>
        </select>
    </div>
    <section class="flex grow flex-col items-start gap-5 rounded-r-xl bg-zinc-900 p-4">
        <div class="flex w-full items-center gap-2">
            <input
                type="text"
                id="search"
                name="search"
                class="min-w-10 grow rounded-sm bg-zinc-950 px-2 py-0.5 text-2xl text-neutral-200"
                maxlength="64"
                placeholder="Search..."
                bind:value={searchText}
            />
            <button class="cursor-pointer" onclick={() => (boardType = 0)}
                ><Boards width="64" class="lighten-hover" /></button
            >
            <button class="cursor-pointer" onclick={() => (boardType = 1)}
                ><Lists width="64" class="lighten-hover" /></button
            >
        </div>
        <section>
            <Pagination
                query={type ? getLevelpackSearch : getLevelSearch}
                text={searchText}
                {type}
                sort={sortCode}
                {featured}
                mod={modded}
                {amount}
                {PageComponent}
                removeOptions
            />
        </section>
    </section>
</section>
<br />

<style>
    /* TODO: fill opacity in the board type options */

    /* It's so weird that whenever I use 100vw the overflow appears, like it technically shouldn't */
    :global(body) {
        overflow-x: hidden;
    }

    .full-width {
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
        padding-left: 1rem;
        padding-right: 1rem;
    }
</style>
