<script lang="ts">
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import type { PageData } from "./$types";
    import { formatDate_Day } from "$lib/misc";
    import Report from "$lib/components/Report.svelte";
    import {
        getUserLevelpacks,
        getUserLevelpackStars,
        getUserLevels,
        getUserLevelStars
    } from "$lib/get.remote";
    import Toggle from "$lib/components/Toggle.svelte";
    getUserLevelStars;

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();
    let { levels, levelpacks, creator } = $derived(data);

    let pageType = $state("Levels");
    let starPageType = $state("Levels");
    let query = $derived.by(() => {
        switch (pageType) {
            case "Levels":
                return getUserLevels;
            case "Levelpacks":
                return getUserLevelpacks;
            case "Stars":
                switch (starPageType) {
                    case "Levels":
                        return getUserLevelStars;
                    case "Levelpacks":
                        return getUserLevelpackStars;
                }
        }
    });
    let PageComponent = $derived.by(() => {
        switch (pageType) {
            case "Levels":
                return LevelComponent;
            case "Levelpacks":
                return LevelpackComponent;
            case "Stars":
                switch (starPageType) {
                    case "Levels":
                        return LevelComponent;
                    case "Levelpacks":
                        return LevelpackComponent;
                }
        }
    });
</script>

<svelte:head>
    <!-- TODO: temp for now, decide whether or not we should have the username on the title -->
    <!-- if we do it, their username may appear on google search page which people might not want -->
    <title>5beam - Play, share and upload BFDIA 5b levels!</title>
    <meta property="og:title" content={creator.username} />
    <meta property="og:description" content="Check out {creator.username}'s levels on 5beam!" />
    <meta property="og:image" content={creator.avatar} />
    <meta name="description" content="Check out {creator.username}'s levels on 5beam!" />
</svelte:head>

<section class="flex items-center gap-2 rounded-t-2xl bg-zinc-900 p-2 font-bold">
    <img src={creator.avatar} alt="Profile" class="h-24 w-24 rounded-full" />
    <div class="w-full px-5">
        <div class="flex items-center">
            <span class="text-7xl">{creator.username}</span>
            <div class="ml-auto">
                <Report kind="user" />
            </div>
        </div>
        <p class="text-4xl text-amber-500">Joined on {formatDate_Day(creator.created)}</p>
    </div>
</section>
<Toggle bind:value={pageType} toggles={["Levels", "Levelpacks", "Stars"]} />
{#if pageType === "Stars"}
    <Toggle bind:value={starPageType} toggles={["Levels", "Levelpacks"]} />
{/if}
<br />
<Pagination {query} id={creator.id} columns={2} {PageComponent} />
