<script lang="ts">
    import { getRandomLevelPageClient } from "$lib/client/ClientSideAPI.js";
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import Button from "$lib/components/Button.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let randomLevelPage = $state(1);
    let randomLevels = $state(data.randomLevels);

    const getMoreLevels = async () => {
        randomLevels = await getRandomLevelPageClient(16, 0, false);
    };
</script>

<svelte:head>
    <meta property="og:title" content="5beam" />
    <meta property="og:description" content="Bored? Click here to play random online 5b levels!" />
    <meta property="og:image" content="https://5beam.zelo.dev/box.png" />
    <meta name="theme-color" content="#d10000" />
</svelte:head>

<div class="flex items-center justify-center">
    <p class="p-5 text-center text-5xl">Random levels!</p>
    <Button onclick={getMoreLevels} text="MORE!!" bg="#ffff00" />
</div>
<Pagination
    callback={() => getRandomLevelPageClient(16, 0, false)}
    removeOptions
    removeMovement
    columns={3}
    PageComponent={LevelComponent}
/>
