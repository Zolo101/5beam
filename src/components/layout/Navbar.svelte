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

    let searchFocused = false;
    $: searchPage = 0;

    const searchResults = writable([]);
    const searchText = writable("");

    searchText.subscribe(async (text) => {
        searchFocused = text.length > 0;
        searchResults.set(await getSearchClient(text, 16));
    });
</script>

<nav>
    <div class="flex h-24 w-[1024px] pt-2">
        <Logo />
        <div class="flex w-full flex-col items-end">
            <div class="list mb-1 flex flex-row gap-2">
                <!--        <a href="/">Levels</a>-->
                <!--        <a href="/levelpacks">Levelpacks</a>-->
                {#if loggedIn}
                    <a href="/upload">Upload</a>
                    <a href="/api">API</a>
                    <a href="/user">Profile ({user.username})</a>
                    <a href="/api/auth/signout/discord">Sign Out</a>
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
                class="w-1/2 rounded-sm bg-neutral-800 px-2 py-0.5 text-2xl text-neutral-200"
                maxlength="64"
                placeholder="Search..."
                bind:value={$searchText}
            />
        </div>
    </div>
</nav>

{#if searchFocused}
    <div
        transition:fly={{ y: 500 }}
        class="absolute z-20 w-full bg-black/80 py-[110px] shadow-2xl backdrop-blur-md"
    >
        <Pagination
            bind:page={searchPage}
            bind:output={$searchResults}
            callback={(page, sort, featured) => getSearchClient($searchText)}
            removeOptions
            removeMovement
        >
            <div class="m-auto max-w-[1600px]">
                <div
                    class="absolute top-[30px] text-6xl transition-colors"
                    style:color={!$searchResults.length ? "#ff7b7b" : "#e5e5e5"}
                >
                    <FiveBStyle text={$searchText} />
                </div>
                {#if $searchResults.length}
                    <!-- TODO: Allow 3 levels in the same row at >1600px width-->
                    <div class="flex w-full flex-wrap gap-4">
                        {#each $searchResults as levelResult}
                            <div on:click={() => (searchFocused = false)}>
                                <LevelComponent glow level={levelResult} />
                            </div>
                        {/each}
                    </div>
                {:else}
                    <p class="w-full text-center text-4xl">No results...</p>
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

    li:hover {
        cursor: pointer;
        font-weight: bold;
    }
</style>
