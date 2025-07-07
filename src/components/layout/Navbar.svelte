<script lang="ts">
    import { fly } from "svelte/transition";
    import { writable } from "svelte/store";
    import Logo from "./Logo.svelte";
    import { getSearchClient } from "../../client/ClientSideAPI";
    import LevelComponent from "../browse/LevelComponent.svelte";
    import Pagination from "../Pagination.svelte";
    import FiveBStyle from "../FiveBStyle.svelte";
    import { usersV2 } from "$lib/pocketbase";
    import type { PocketbaseUser } from "$lib/types";
    import { toPOJO } from "../../talk/get";

    interface Props {
        user: PocketbaseUser;
    }

    let { user = $bindable() }: Props = $props();

    let loggedIn = $state(!!user);

    let searchFocused = $state(false);
    let searchPage = $state(0);
    

    const searchResults = writable([]);
    const searchText = writable("");

    // TODO: I believe svelte 5 fixes this but for some reason
    // it runs on page load, causing getSearchClient to be called
    // EACH TIME!!!
    // So this is a temp fix
    searchText.subscribe(async (text) => {
        searchFocused = text.length > 0;
        if (searchFocused) {
            searchResults.set(await getSearchClient(text, 16));
        }
    });

    const logIn = async () => {
        try {
            const res = await usersV2.authWithOAuth2({ provider: "discord", scopes: ["identify"] });
            // The response contains auth data and user info
            if (res) {
                // Convert the record to a plain object and update the user state
                const userData = toPOJO(res.record) as unknown as PocketbaseUser;
                user = userData;
                loggedIn = true;
                // Redirect to the callback URL if needed
                if (res.meta?.redirectUrl) {
                    window.location.href = res.meta.redirectUrl;
                }
            }
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
</script>

<nav>
    <div class="mx-5 flex h-24 grow justify-between pt-2">
        <Logo />
        <div class="list mb-1 flex flex-row items-center gap-2 text-xl">
            <input
                type="text"
                id="search"
                name="search"
                class="rounded-sm bg-neutral-800 px-2 py-0.5 text-2xl text-neutral-200 max-lg:w-40"
                maxlength="64"
                placeholder="Search..."
                bind:value={$searchText}
            />
            <a href="/upload">Upload</a>
            <!-- <a href="/mods">Mods</a> -->
            {#if loggedIn}
                <a href="/user">Profile</a>
                <a href="/api/auth/signout/discord">Log Out</a>
            {:else}
                <a href="/" onclick={logIn}>Log In</a>
            {/if}
            <span>•</span>
            <a href="/discord">Discord</a>
        </div>
    </div>
</nav>

{#if searchFocused}
    <div
        transition:fly={{ y: 500 }}
        class="absolute top-24 z-20 w-full bg-black/80 py-10 shadow-2xl backdrop-blur-md"
    >
        <Pagination
            bind:page={searchPage}
            bind:output={$searchResults}
            callback={() => getSearchClient($searchText)}
            removeOptions
            removeMovement
        >
            <div class="flex flex-col gap-5">
                <div
                    class="mx-10 flex justify-between text-6xl transition-colors"
                    style:color={!$searchResults.length ? "#ff7b7b" : "#e5e5e5"}
                >
                    <div>
                        <FiveBStyle text={$searchText} />
                    </div>
                    <button
                        class="font-black transition-transform hover:scale-120"
                        onclick={() => (searchFocused = false)}>✕</button
                    >
                </div>
                {#if $searchResults.length}
                    <!-- TODO: Allow 3 levels in the same row at >1600px width-->
                    <div class="flex w-full flex-wrap justify-center gap-4">
                        {#each $searchResults as levelResult}
                            <LevelComponent glow level={levelResult} />
                        {/each}
                    </div>
                {:else}
                    <p class="w-full text-center text-4xl">No results...</p>
                {/if}
            </div>
        </Pagination>
    </div>
{/if}
