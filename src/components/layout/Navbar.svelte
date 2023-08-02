<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import Logo from "./Logo.svelte";
    import { logIn } from "$lib/pocketbase";

    // let user = $session.user
    // let loggedIn = !!user
    let loggedIn = false
    // console.log("userinfo", user)

    const searchResults = writable([])
    const searchText = writable("")

    onMount(() => {
        // const searchElement: HTMLInputElement = document.querySelector("#search")
        // searchElement.addEventListener("keyup", async () => {
        //     const value = searchElement.value.trim()
        //     searchResults.set(await getSearchClient(value))
        //     searchText.set(value)
        // })
    })
</script>

<div class="navbar">
    <Logo/>
    <div class="list">
<!--        <a href="/">Levels</a>-->
<!--        <a href="/levelpacks">Levelpacks</a>-->
<!--        <a href="/upload">Upload</a>-->
<!--        <a href="/api">API</a>-->
        {#if loggedIn}
<!--            <a href="/profile">Profile</a>-->
<!--            <a href="/api/auth/signout/discord">Sign Out ({user.username})</a>-->
        {:else}
            <a class="cursor-pointer" on:click={() => logIn()}>Log In</a>
        {/if}
    </div>
<!--    <div class="list-right">-->
<!--        <input-->
<!--                type="text"-->
<!--                id="search"-->
<!--                class="search"-->
<!--                name="search"-->
<!--                maxlength="64"-->
<!--                placeholder="Search...">-->
<!--        <SearchResults search={$searchText} results={$searchResults}/>-->
<!--    </div>-->
</div>

<style>
    .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        background: linear-gradient(white, #e9e9e9, white);
        padding: 5px;
        @apply text-neutral-900;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .list a {
        @apply inline text-3xl bg-neutral-200 px-4 py-1 mx-2 rounded transition-colors;
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

    .search {
        background-color: darkgrey;
        font-size: 1.5em;
        border-radius: 4px;
        border: none;
    }
</style>