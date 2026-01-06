<script lang="ts">
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import { getUserLevelPageClient } from "$lib/client/ClientSideAPI";
    import Pagination from "$lib/components/Pagination.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import type { PageData } from "./$types";
    import { formatDate_Day } from "$lib/misc";
    import ReportDialog from "$lib/components/ReportDialog.svelte";
    import Button from "$lib/components/Button.svelte";
    import { getUserLevelpacks, getUserLevels } from "$lib/get.remote";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    let { levels, levelpacks, creator } = $derived(data);

    let reportMode = $state(false);
    let reportSending = $state(false);
</script>

<svelte:head>
    <!-- TODO: temp for now, decide whether or not we should have the username on the title -->
    <!-- if we do it, their username may appear on google search page which people might not want -->
    <title>5beam - Play, share and upload BFDIA 5b levels!</title>
    <meta property="og:title" content={creator.username} />
    <meta property="og:description" content="Check out {creator.username}'s levels on 5beam!" />
    <meta property="description" content="Check out {creator.username}'s levels on 5beam!" />
</svelte:head>

<section class="flex flex-col items-center gap-2 font-bold">
    <div class="flex items-center gap-5">
        <span class="text-7xl">{creator.username}</span>
        <!-- TODO: Make this a component? -->
        <Button
            text={reportSending ? "Reported" : "Report"}
            bg="#ff5555"
            onclick={() => (reportMode = !reportMode)}
            disabled={reportSending}
        />
    </div>
    <p class="text-4xl text-amber-500">Joined on {formatDate_Day(creator.created)}</p>
</section>

<ReportDialog bind:open={reportMode} bind:reportSending kind="user" />

<h2>Levels</h2>
<div class="flex flex-col items-center">
    {#if levels.length}
        <Pagination
            query={getUserLevels}
            id={creator.id}
            columns={2}
            PageComponent={LevelComponent}
        />
    {:else}
        <p>User has no levels!</p>
    {/if}
    <br />
</div>
<h2>Levelpacks</h2>
<div class="flex flex-col items-center">
    {#if levelpacks.length}
        <Pagination
            query={getUserLevelpacks}
            id={creator.id}
            columns={2}
            PageComponent={LevelpackComponent}
        />
    {:else}
        <p>User has no levelpacks!</p>
    {/if}
</div>
