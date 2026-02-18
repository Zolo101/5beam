<script lang="ts">
    import { getUserStarredLevelPageClient } from "$lib/client/ClientSideAPI";
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
    let { starredLevels, starredLevelpacks, user } = $derived(data);
</script>

<svelte:head>
    <title>Your Stars - 5beam</title>
    <meta name="description" content="View your starred BFDIA 5b levels and levelpacks on 5beam." />
    <meta name="robots" content="noindex" />
</svelte:head>

<h2>Starred Levels</h2>
<div class="flex flex-col items-center">
    {#if starredLevels.length}
        <Pagination
            callback={({ page, sort, featured, amount }) =>
                getUserStarredLevelPageClient(user?.record.id, page, 0, sort, featured, amount)}
            columns={2}
            PageComponent={LevelComponent}
        />
    {:else}
        <p>No levels starred!</p>
    {/if}
    <br />
</div>
<h2>Starred Levelpacks</h2>
<div class="flex flex-col items-center">
    {#if starredLevelpacks.length}
        <Pagination
            callback={({ page, sort, featured, amount }) =>
                getUserStarredLevelPageClient(user?.record.id, page, 1, sort, featured, amount)}
            columns={2}
            PageComponent={LevelpackComponent}
        />
    {:else}
        <p>No levelpacks starred!</p>
    {/if}
</div>
