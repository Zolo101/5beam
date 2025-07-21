<script lang="ts">
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import { getUserLevelPageClient } from "$lib/client/ClientSideAPI";
    import Pagination from "$lib/components/Pagination.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import type { PageData } from "./$types";
    import { formatDate_Day } from "$lib/misc";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    let { levels, levelpacks, creator } = $derived(data);

    let levelPage = $state(1);
    let levelpackPage = $state(1);
</script>

<svelte:head>
    <meta property="og:title" content={creator.username} />
    <meta property="og:description" content="Check out {creator.username}'s levels on 5beam!" />
</svelte:head>

<section class="mx-auto max-w-1/2 font-bold">
    <p class="text-7xl">{creator.username}</p>
    <p class="text-4xl text-amber-500">Joined on {formatDate_Day(creator.created)}</p>
</section>

<div class="flex flex-col items-center">
    <h2>Levels</h2>
    {#if levels.length}
        <Pagination
            bind:page={levelPage}
            bind:output={levels}
            callback={({ page, sort, featured, amount }) =>
                getUserLevelPageClient(creator.id, page, 0, sort, featured, amount)}
            columns={2}
            PageComponent={LevelComponent}
        />
    {:else}
        <p>User has no levels!</p>
    {/if}
    <br />
    <h2>Levelpacks</h2>
    {#if levelpacks.length}
        <Pagination
            bind:page={levelpackPage}
            bind:output={levelpacks}
            callback={({ page, sort, featured, amount }) =>
                getUserLevelPageClient(creator.id, page, 1, sort, featured, amount)}
            columns={2}
            PageComponent={LevelpackComponent}
        />
    {:else}
        <p>User has no levelpacks!</p>
    {/if}
</div>
