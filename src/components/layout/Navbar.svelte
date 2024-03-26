<script lang="ts">
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
    import Logo from "./Logo.svelte";
    import { getSearchClient } from "../../client/ClientSideAPI";
    import LevelComponent from "../browse/LevelComponent.svelte";
    import Pagination from "../Pagination.svelte";
    import FiveBStyle from "../FiveBStyle.svelte";

    export let user: User;

    let loggedIn = !!user;

    let searchFocused = false
    $: searchPage = 0

    const searchResults = writable([])
    const searchText = writable("")

    searchText.subscribe(async (text) => {
        searchFocused = text.length > 0
        searchResults.set(await getSearchClient(text, 16))
    })
</script>

<nav>
    <div class="flex w-[1024px] h-24 pt-2">
        <Logo/>
        <div class="w-full flex flex-col items-end">
            <div class="flex flex-row gap-2 list mb-1">
        <!--        <a href="/">Levels</a>-->
        <!--        <a href="/levelpacks">Levelpacks</a>-->
                {#if loggedIn}
                    <a href="/upload">Upload</a>
                    <a href="/api">API</a>
                    <a href="/user">Profile</a>
                    <a href="/api/auth/signout/discord">Sign Out ({user.username})</a>
                {:else}
                    <a href="/api">API</a>
                    <a href="/api/auth/discord">Log In</a>
                {/if}
    <!--        </div>-->
    <!--        <div>-->
        <!--        <SearchResults search={$searchText} results={$searchResults}/>-->
            </div>
            <input
                    type="text"
                    id="search"
                    name="search"
                    class="w-1/2 text-neutral-200 bg-neutral-800 text-2xl rounded px-2 py-0.5"
                    maxlength="64"
                    placeholder="Search..."
                    bind:value={$searchText}
            >
        </div>
    </div>
</nav>

{#if searchFocused}
    <div transition:fly={{y: 500}} class="w-full backdrop-blur-md bg-black/80 shadow-2xl absolute z-20 py-[110px]">
        <Pagination
                bind:page={searchPage}
                bind:output={$searchResults}
                callback={(page, sort, featured) => getSearchClient($searchText)}
                removeOptions
                removeMovement
        >
                <div class="m-auto max-w-[1600px]">
                    <div class="text-6xl absolute top-[30px] transition-colors" style:color={!$searchResults.length ? "#ff7b7b" : "#e5e5e5"}>
                        <FiveBStyle text={$searchText}/>
                    </div>
                    {#if $searchResults.length}
                        <!-- TODO: Allow 3 levels in the same row at >1600px width-->
                        <div class="flex flex-wrap gap-4 w-full">
                            {#each $searchResults as levelResult}
                                <div on:click={() => searchFocused = false}>
                                    <LevelComponent glow level={levelResult}/>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="w-full text-4xl text-center">No results...</p>
                    {/if}
                </div>
        </Pagination>
    </div>
{/if}

<style>
    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .list a {
        @apply text-2xl text-neutral-200 bg-neutral-800 px-4 py-1 drop-shadow-2xl rounded transition-colors;
        /*padding: 3px 10px;*/
        /*margin: 0 5px;*/
        /*border-radius: 4px;*/
    }

    .list a:hover {
        @apply bg-neutral-900;
    }

    li:hover {
        cursor: pointer;
        font-weight: bold;
    }
</style>