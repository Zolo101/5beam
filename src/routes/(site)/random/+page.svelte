<script lang="ts">
    import { getRandomLevelPageClient } from "../../../client/ClientSideAPI.js";
    import LevelComponent from "../../../components/browse/LevelComponent.svelte";
    import Pagination from "../../../components/Pagination.svelte";
    import { writable } from "svelte/store";
    import type { PageData } from "../../../../.svelte-kit/types/src/routes";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let randomLevelPage = $state(1);
    
    const randomLevels = writable(data.randomLevels);
</script>

<svelte:head>
    <meta property="og:title" content="5beam" />
    <meta property="og:description" content="Bored? Click here to play random online 5b levels!" />
    <meta property="og:image" content="https://5beam.zelo.dev/box.png" />
    <meta name="theme-color" content="#d10000" />
</svelte:head>

<p class="p-5 text-center text-3xl">Refresh for new random levels!</p>
<Pagination
    bind:page={randomLevelPage}
    bind:output={$randomLevels}
    callback={(page, sort, featured) => getRandomLevelPageClient(16, 0, 0)}
    removeOptions
    removeMovement
>
    <div class="m-auto flex flex-wrap justify-center gap-4">
        {#each $randomLevels as randomLevel}
            <LevelComponent level={randomLevel} />
        {/each}
    </div>
</Pagination>
