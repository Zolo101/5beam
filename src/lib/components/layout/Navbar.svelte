<script lang="ts">
    import { fade } from "svelte/transition";
    import Logo from "./Logo.svelte";
    import { getSearchClient } from "$lib/client/ClientSideAPI";
    import type { PocketbaseUser } from "$lib/types";
    import { enhance } from "$app/forms";
    import { page } from "$app/state";

    import DefaultPFP from "$lib/assets/icons/defaultPFP.svg?component";
    import Dropdown from "$lib/assets/icons/dropdown.svg?component";

    let { user = $bindable() }: { user: PocketbaseUser } = $props();
    let { admin, loggedIn } = $derived(page.data);

    let searchFocused = $state(false);
    let dropdownOpen = $state(false);

    let searchResults = $state([]);
    let searchText = $state("");

    $effect(() => {
        searchFocused = searchText.length > 0;
        if (searchFocused) {
            getSearchClient(searchText).then((results) => {
                searchResults = results;
            });
        }
    });
</script>

<nav class="flex items-center justify-center bg-black p-1.5 text-neutral-200">
    <div class="container m-auto mx-5 flex h-24 grow justify-between pt-2">
        <Logo />
        <section class="flex items-center gap-5 text-3xl font-medium">
            <a href="/discover">Discover</a>
            <span>•</span>
            <a href="/upload">Upload</a>
            <span>•</span>
            <a href="https://discord.gg/Xm8xzhEFjy" target="_blank">Discuss</a>
        </section>
        <div class="list mb-1 flex flex-row items-center gap-3 text-xl">
            {#if loggedIn}
                <div class="relative flex items-center gap-2">
                    <button
                        onclick={() => (dropdownOpen = !dropdownOpen)}
                        class="flex items-center gap-2 rounded-sm bg-transparent! transition-colors"
                    >
                        <!-- TODO: make this a component, this is being used in the settings page -->
                        <!-- zelo: If you get a weird svg related error during development, its sveltekit-svg acting weird, comment this out then restart -->
                        {#if user?.record?.avatar}
                            <img src={user.record.avatar} alt="Profile" class="w-12 rounded-full" />
                        {:else}
                            <DefaultPFP aria-valuetext="Profile" class="h-12 w-12" />
                        {/if}
                        <Dropdown
                            width="20"
                            class={[
                                dropdownOpen ? "rotate-180" : "rotate-0",
                                "transition-transform"
                            ]}
                        />
                    </button>
                    {#if dropdownOpen}
                        <div
                            transition:fade={{ duration: 100 }}
                            class="dropdown absolute top-full right-0 z-10 mt-1 flex w-48 flex-col gap-1 rounded-sm bg-stone-800 py-2 shadow-lg"
                        >
                            <span class="text-center text-sm">{user?.record.username}</span>
                            <a
                                href="/user"
                                onclick={() => (dropdownOpen = false)}
                                class="px-4 py-2 text-neutral-200 transition-colors hover:bg-neutral-700"
                            >
                                Profile
                            </a>
                            <a
                                href="/stars"
                                onclick={() => (dropdownOpen = false)}
                                class="px-4 py-2 text-neutral-200 transition-colors hover:bg-neutral-700"
                            >
                                My Starred
                            </a>
                            {#if admin}
                                <a href="/reports" class="px-4 py-2">Reports</a>
                            {/if}
                            <a
                                href="/user/settings"
                                onclick={() => (dropdownOpen = false)}
                                class="px-4 py-2 text-neutral-200 transition-colors hover:bg-neutral-700"
                            >
                                Settings
                            </a>
                            <form method="POST" action="/logout" class="w-full">
                                <button
                                    type="submit"
                                    onclick={() => (dropdownOpen = false)}
                                    class="w-full px-4 py-2 text-left text-neutral-200 transition-colors hover:bg-neutral-700"
                                >
                                    Log Out
                                </button>
                            </form>
                        </div>
                    {/if}
                </div>
            {:else}
                <form use:enhance method="POST" action="/login">
                    <button
                        type="submit"
                        class="w-30 px-4 py-1 text-neutral-200 transition-colors hover:bg-neutral-700"
                        >Log In</button
                    >
                </form>
            {/if}
        </div>
    </div>
</nav>

<!-- {#if uploadDialogOpen}
    <UploadDialog {loggedIn} />
{/if} -->

<!-- {#if searchFocused}
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
                <div class="flex w-full flex-wrap justify-center gap-4">
                    <Pagination
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
{/if} -->

<style>
    /* nav {
        background: linear-gradient(
            rgba(255, 255, 255, 0.2),
            rgba(233, 233, 233, 0.2) 90%,
            rgba(255, 255, 255, 0)
        );
    } */

    .list {
        a,
        :global(button) {
            cursor: pointer;
            border-radius: 0.375rem;
            background: var(--color-stone-800);
            color: var(--color-neutral-200);
            /* box-shadow: var(--tw-drop-shadow-2xl); */
            transition:
                color 0.2s,
                background-color 0.2s;
            /* @apply cursor-pointer rounded bg-neutral-800 px-4 py-1 text-neutral-200 drop-shadow-2xl transition-colors; */
        }

        a:hover,
        :global(button):hover {
            background: var(--color-stone-700);
            /* @apply bg-neutral-900; */
        }
    }

    /* TODO: Inset rainbow? */
    .rainbow-outline {
        animation: rainbow-outline 10s linear infinite;
        --rainbow-outline-width: 3px;
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
