<script lang="ts">
    import { onMount } from "svelte";
    import SearchResults from "./SearchResults.svelte";
    import { getSearchClient } from "./client/ClientSideAPI";
    import { writable } from "svelte/store";

    // let user = $session.user
    // let loggedIn = !!user
    let loggedIn = false
    // console.log("userinfo", user)

    const searchResults = writable([])
    const searchText = writable("")

    onMount(() => {
        const searchElement: HTMLInputElement = document.querySelector("#search")
        searchElement.addEventListener("keyup", async () => {
            const value = searchElement.value.trim()
            searchResults.set(await getSearchClient(value))
            searchText.set(value)
        })
    })
</script>

<div class="navbar">
    <a href="/" class="title">
        <h1>5beam</h1>
    </a>
    <div class="list-left">
        <a href="/">Levels</a>
        <a href="/levelpacks">Levelpacks</a>
        <a href="/upload">Upload</a>
        <a href="/api">API</a>
        {#if loggedIn}
<!--            <a href="/profile">Profile</a>-->
<!--            <a href="/api/auth/signout/discord">Sign Out ({user.username})</a>-->
        {:else}
            <a href="/api/auth/discord">Log In</a>
        {/if}
    </div>
    <div class="list-right">
        <input
                type="text"
                id="search"
                class="search"
                name="search"
                maxlength="64"
                placeholder="Search...">
        <SearchResults search={$searchText} results={$searchResults}/>
    </div>
</div>

<style>
    .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-direction: row;
        background: linear-gradient(white, #e9e9e9, white);
        padding: 5px;
    }

    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin: 0;
        padding: 0 20px;
    }

    .title:hover {
        background-color: #e1e1e1;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .list-left a, .list-right a {
        font-size: 1.5rem;
        background-color: darkgray;
        color: black;
        text-decoration: none;
        display: inline;
        padding: 3px 10px;
        margin: 0 5px;
        border-radius: 4px;
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