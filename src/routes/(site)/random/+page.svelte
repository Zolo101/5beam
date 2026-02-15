<script lang="ts">
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import { getRandomLevels } from "$lib/get.remote";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
</script>

<svelte:head>
    <meta property="og:title" content="5beam" />
    <meta property="og:description" content="Bored? Click here to play random online 5b levels!" />
    <meta property="og:image" content="https://5beam.zelo.dev/box.png" />
    <meta name="theme-color" content="#d10000" />
</svelte:head>

<div class="flex items-center justify-center">
    <p class="p-5 text-center text-5xl">Random levels!</p>
</div>
<Pagination
    query={getRandomLevels}
    removeOptions
    removeMovement
    columns={3}
    PageComponent={LevelComponent}
/>
