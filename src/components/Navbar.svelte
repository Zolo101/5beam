<script lang="ts">
    import { signOut as authSignOut } from 'sk-auth/client';
    import { session } from '$app/stores';

    $: user = $session.user;
    let loggedIn = !!user;
    let username;

    function signOut() {
        authSignOut().then(session.set);
    }
</script>

<div class="navbar">
    <h1>5beam</h1>
    <div class="list">
        <a href="/">Browse</a>
        <a href="/upload">Upload</a>
        <a href="/api">API</a>
        {#if loggedIn}
            <a href="" on:click={signOut}>Sign Out ({username})</a>
        {:else}
            <a href="/api/auth/signin/discord">Log In</a>
        {/if}
    </div>
</div>

<style>
    .navbar {
        display: flex;
        align-items: center;
        flex-direction: row;
        background: linear-gradient(white, #e9e9e9, white);
        padding: 5px;
    }

    h1 {
        font-size: 3rem;
        margin: 0;
        padding: 0 20px;
    }

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    .list a {
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
</style>