<script lang="ts">
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import { getUserLevelPageClient } from "$lib/client/ClientSideAPI";
    import Pagination from "$lib/components/Pagination.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import type { PageData } from "./$types";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    // TODO: We should probably rename to creator on this specific page
    let { levels, levelpacks, creator: user } = $derived(data);

    let date = new Date(user.created);
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();

    let levelPage = $state(1);

    let levelpackPage = $state(1);
</script>

<svelte:head>
    <meta property="og:title" content={user.username} />
    <meta property="og:description" content="Check out {user.username}'s levels on 5beam!" />
</svelte:head>

<section class="font-bold">
    <p class="text-7xl">{user.username}</p>
    <p class="text-4xl text-amber-500">Joined on {month}-{year}</p>
</section>

<div class="flex flex-col items-center">
    <h2>Levels</h2>
    {#if levels.length}
        <Pagination
            bind:page={levelPage}
            bind:output={levels}
            callback={({ page, sort, featured, amount }) =>
                getUserLevelPageClient(user.id, page, 0, sort, featured, amount)}
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
                getUserLevelPageClient(user.id, page, 1, sort, featured, amount)}
            columns={2}
            PageComponent={LevelpackComponent}
        />
    {:else}
        <p>User has no levelpacks!</p>
    {/if}
</div>
