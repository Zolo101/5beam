<script lang="ts">
    import type { PageData } from "./$types";
    import Pagination from "$lib/components/Pagination.svelte";
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import { getLevelpackSearch, getLevelSearch } from "$lib/get.remote";

    import Boards from "$lib/assets/icons/Boards.svg?component";
    import Lists from "$lib/assets/icons/Lists.svg?component";
    import LevelListComponent from "$lib/components/browse/LevelListComponent.svelte";

    import Book from "$lib/assets/characters/Book.svg?component";
    import Bubble from "$lib/assets/characters/Bubble.svg?component";
    import IceCube from "$lib/assets/characters/Ice Cube.svg?component";
    import LegoBrick from "$lib/assets/characters/Lego Brick.svg?component";
    import Match from "$lib/assets/characters/Match.svg?component";
    import Pencil from "$lib/assets/characters/Pencil.svg?component";
    import Ruby from "$lib/assets/characters/Ruby.svg?component";
    import Tune from "$lib/assets/characters/Tune.svg?component";
    import Waffle from "$lib/assets/characters/Waffle.svg?component";

    let { data }: { data: PageData } = $props();

    const characters = [
        { name: "9azb46ypgafu271", component: Book },
        { name: "ihnvzp3mbty59z3", component: Bubble },
        { name: "vllrchrqxdo1o5y", component: IceCube },
        { name: "bl212buwh7k37a4", component: LegoBrick },
        { name: "y8ge9xhroc7w3fj", component: Match },
        { name: "m5d9bccwongwpfa", component: Pencil },
        { name: "s4dmiou51ox6tra", component: Ruby },
        { name: "cne8pxayuxcy02e", component: Tune },
        { name: "a16m9z4avnsa5s3", component: Waffle }
    ];

    // let description = $state("");
    let type = $state(0);
    let modded = $state("");
    let area = $state(0);
    let selectedCharacters = $state<string[]>([]);
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

<svelte:head>
    <title>Discover - 5beam</title>
    <meta name="description" content="Search and browse BFDIA 5b levels and levelpacks on 5beam." />
    <meta property="og:title" content="Discover - 5beam" />
    <meta
        property="og:description"
        content="Search and browse BFDIA 5b levels and levelpacks on 5beam."
    />
    <meta property="og:image" content="https://5beam.zelo.dev/box.png" />
</svelte:head>

<section class="full-width flex">
    <div
        class="flex min-w-64 flex-col gap-1 rounded-l-xl bg-zinc-800 p-5 text-xl shadow-lg [&_label]:pt-6 [&_label]:font-bold"
    >
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
            <option value={""}>None</option>
            <option value={"golden5"}>Golden 5</option>
            <option value={"5*"}>5*30</option>
        </select>
        <!-- TODO: Reset to defaults if disabled -->
        <label for="size">Size</label>
        <select
            bind:value={area}
            name="size"
            disabled={!!modded}
            class="rounded-lg bg-black/30 p-2.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
            <option value={0}>Any</option>
            <option value={1}>Small</option>
            <option value={2}>Medium</option>
            <option value={3}>Large</option>
        </select>
        <label for="characters">Characters</label>
        <div class="flex flex-wrap gap-3">
            {#each characters as char}
                <button
                    type="button"
                    onclick={() => {
                        if (selectedCharacters.includes(char.name)) {
                            selectedCharacters = selectedCharacters.filter((c) => c !== char.name);
                        } else {
                            selectedCharacters = [...selectedCharacters, char.name];
                        }
                    }}
                    disabled={!!modded}
                    class={[
                        selectedCharacters.includes(char.name) ? "bg-blue-900" : "bg-black/30",
                        "rounded-lg p-2 ring-2 ring-transparent transition hover:ring-blue-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                    ]}
                    title={char.name}
                >
                    <char.component width="48" height="48" />
                </button>
            {/each}
        </div>
    </div>
    <section class="flex grow flex-col items-start gap-5 rounded-r-xl bg-zinc-900 p-4">
        <div class="flex w-full items-center gap-2">
            <input
                type="text"
                id="search"
                name="search"
                class="min-w-10 grow rounded-lg bg-zinc-950 px-4 py-2 text-2xl text-neutral-100"
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
                areaCode={area}
                characters={selectedCharacters}
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
