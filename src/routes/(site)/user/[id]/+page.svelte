<script lang="ts">
    import LevelComponent from "../../../../components/browse/LevelComponent.svelte";
    import { writable } from "svelte/store";
    import { getUserLevelPageClient } from "../../../../client/ClientSideAPI";
    import Pagination from "../../../../components/Pagination.svelte";
    import LevelpackComponent from "../../../../components/browse/LevelpackComponent.svelte";
    import type { PageData } from "../../../../../.svelte-kit/types/src/routes";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let user = data.creator;
    const levels = writable(data.levels);
    const levelpacks = writable(data.levelpacks);

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
    {#if user.levels.length}
        <Pagination
            bind:page={levelPage}
            bind:output={$levels}
            callback={(page, sort, featured) =>
                getUserLevelPageClient(user.id, page, 0, sort, featured)}
        >
            <div class="m-auto flex flex-wrap gap-4">
                {#each $levels as level}
                    <LevelComponent {level} />
                {/each}
            </div>
        </Pagination>
    {:else}
        <p>User has no levels!</p>
    {/if}
    <br />
    <h2>Levelpacks</h2>
    {#if user.levelpacks.length}
        <Pagination
            bind:page={levelpackPage}
            bind:output={$levelpacks}
            callback={(page, sort, featured) =>
                getUserLevelPageClient(user.id, page, 1, sort, featured)}
        >
            <div class="m-auto flex flex-wrap gap-4">
                {#each $levelpacks as levelpack}
                    <LevelpackComponent {levelpack} />
                {/each}
            </div>
        </Pagination>
    {:else}
        <p>User has no levelpacks!</p>
    {/if}
</div>
