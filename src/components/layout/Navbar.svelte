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

<div class="navbar">
    <Logo/>
    <div class="flex items-center">
        <div class="list mr-5">
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
            <input
                    type="text"
                    id="search"
                    name="search"
                    class="w-24 bg-neutral-200 text-2xl rounded px-2 py-0.5"
                    maxlength="64"
                    placeholder="Search..."
                    bind:value={$searchText}
            >
    <!--        <SearchResults search={$searchText} results={$searchResults}/>-->
        </div>
    </div>
</div>

{#if searchFocused}
    <div transition:fly={{y: 500}} class="w-full backdrop-blur-md bg-black/80 shadow-2xl absolute z-20 py-[110px]">
        <Pagination
                bind:page={searchPage}
                bind:output={$searchResults}
                callback={(page, sort, featured) => getSearchClient($searchText)}
                removeOptions
                removeMovement
        >
                <div class="m-auto max-w-[900px]">
                    <div class="text-6xl absolute top-[30px]">
                        <FiveBStyle text={$searchText}/>
                    </div>
                    {#if $searchResults.length}
                        <div class="flex flex-wrap m-auto gap-4 max-w-[900px]">
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
    .navbar {
        background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(233, 233, 233, 0.2) 75%, rgba(255, 255, 255, 0.0));
        padding: 5px;
        @apply flex flex-row items-center justify-between p-1.5 text-black backdrop-blur-[6px];
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .list a {
        @apply inline text-2xl bg-neutral-200 px-4 py-1 mx-2 drop-shadow-2xl rounded transition-colors;
        /*padding: 3px 10px;*/
        /*margin: 0 5px;*/
        /*border-radius: 4px;*/
    }

    .list a:hover {
        @apply bg-neutral-300;
    }

    li:hover {
        cursor: pointer;
        font-weight: bold;
    }
</style>