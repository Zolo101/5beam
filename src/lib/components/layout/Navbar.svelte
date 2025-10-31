<script lang="ts">
    import { fly } from "svelte/transition";
    import Logo from "./Logo.svelte";
    import { getSearchClient } from "$lib/client/ClientSideAPI";
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import FiveBStyle from "$lib/components/FiveBStyle.svelte";
    import type { PocketbaseUser } from "$lib/types";
    import questionIcon from "$lib/assets/question.png";
    import { enhance } from "$app/forms";
    import { page } from "$app/state";

    let { user = $bindable() }: { user: PocketbaseUser } = $props();
    let { admin, loggedIn } = $derived(page.data);

    let searchFocused = $state(false);
    let searchPage = $state(0);

    let searchResults = $state([]);
    let searchText = $state("");

    // TODO: I believe svelte 5 fixes this but for some reason
    // it runs on page load, causing getSearchClient to be called
    // EACH TIME!!!
    // So this is a temp fix

    $effect(() => {
        searchFocused = searchText.length > 0;
        if (searchFocused) {
            getSearchClient(searchText).then((results) => {
                searchResults = results;
            });
        }
    });
</script>

<nav class="flex items-center justify-center p-1.5 text-black backdrop-blur-[4px]">
    <div class="mx-5 flex h-24 grow justify-between pt-2">
        <Logo />
        <div class="list mb-1 flex flex-row items-center gap-3 text-xl">
            <input
                type="text"
                id="search"
                name="search"
                class="w-full min-w-10 rounded-sm bg-neutral-800 px-2 py-0.5 text-2xl text-neutral-200"
                maxlength="64"
                placeholder="Search... if you dare..."
                bind:value={searchText}
            />
            <a href="/upload" class="rainbow-outline">Upload</a>
            <!-- <a href="/mods">Mods</a> -->

            {#if admin}
                <a href="/reports">Reports</a>
            {/if}
            {#if loggedIn}
                <!-- TODO: Removed temp until we make a pocketbase module that updates 5beam_users upon oauth -->
                <!-- <a href="/user" class="p-0!" -->
                <a href="/user"
                    >Profile
                    <!-- {#if user.record.avatar}
                        <img src={user.record.avatar} alt="Profile" class="max-w-9 min-w-9 rounded" />
                    {:else}
                        <img src={questionIcon} alt="Profile" class="max-w-9 min-w-9 rounded" />
                    {/if} -->
                </a>
                <form method="POST" action="/logout">
                    <button type="submit" class="w-30">Log Out</button>
                </form>
            {:else}
                <form use:enhance method="POST" action="/login">
                    <button type="submit" class="w-30">Log In</button>
                </form>
            {/if}
            <span>•</span>
            <a href="https://discord.gg/Xm8xzhEFjy" target="_blank">Discord</a>
        </div>
    </div>
</nav>

{#if searchFocused}
    <div
        transition:fly={{ y: 500 }}
        class="absolute top-24 z-20 w-full bg-black/80 py-10 shadow-2xl backdrop-blur-md"
    >
        <div class="flex flex-col gap-5">
            <div
                class="mx-10 flex justify-between text-6xl transition-colors"
                style:color={!searchResults.length ? "#ff7b7b" : "#e5e5e5"}
            >
                <div>
                    <FiveBStyle text={searchText} />
                </div>
                <button
                    class="font-black transition-transform hover:scale-120"
                    onclick={() => (searchText = "")}>✕</button
                >
            </div>
            {#if searchResults.length}
                <!-- TODO: Allow 3 levels in the same row at >1600px width-->
                <div class="flex w-full flex-wrap justify-center gap-4">
                    <Pagination
                        bind:page={searchPage}
                        bind:output={searchResults}
                        callback={({ amount }) => getSearchClient(searchText, amount)}
                        columns={2}
                        removeOptions
                        removeMovement
                        PageComponent={LevelComponent}
                    />
                </div>
            {:else}
                <p class="w-full text-center text-4xl">No results...</p>
            {/if}
        </div>
    </div>
{/if}

<style>
    nav {
        background: linear-gradient(
            rgba(255, 255, 255, 0.2),
            rgba(233, 233, 233, 0.2) 90%,
            rgba(255, 255, 255, 0)
        );
    }

    /* TODO: Inset rainbow? */
    .rainbow-outline {
        animation: rainbow-outline 10s linear infinite;
        --rainbow-outline-width: 2px;
        --rainbow-outline-blur: 0px;
    }

    @keyframes rainbow-outline {
        0% {
            box-shadow:
                0 0 0 var(--rainbow-outline-width) #ff0000,
                0 0 var(--rainbow-outline-blur) var(--rainbow-outline-width) #ff0000;
        }
        16% {
            box-shadow:
                0 0 0 var(--rainbow-outline-width) #ff9900,
                0 0 var(--rainbow-outline-blur) var(--rainbow-outline-width) #ff9900;
        }
        33% {
            box-shadow:
                0 0 0 var(--rainbow-outline-width) #ffee00,
                0 0 var(--rainbow-outline-blur) var(--rainbow-outline-width) #ffee00;
        }
        50% {
            box-shadow:
                0 0 0 var(--rainbow-outline-width) #33ff00,
                0 0 var(--rainbow-outline-blur) var(--rainbow-outline-width) #33ff00;
        }
        66% {
            box-shadow:
                0 0 0 var(--rainbow-outline-width) #00aaff,
                0 0 var(--rainbow-outline-blur) var(--rainbow-outline-width) #00aaff;
        }
        83% {
            box-shadow:
                0 0 0 var(--rainbow-outline-width) #6600ff,
                0 0 var(--rainbow-outline-blur) var(--rainbow-outline-width) #6600ff;
        }
        100% {
            box-shadow:
                0 0 0 var(--rainbow-outline-width) #ff0000,
                0 0 var(--rainbow-outline-blur) var(--rainbow-outline-width) #ff0000;
        }
    }
</style>
