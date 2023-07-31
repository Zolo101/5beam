<script lang="ts">
    import { getUserByIdClient } from "./client/ClientSideAPI";

    export let id: string;
    export let prefix: string;
</script>

<span>{prefix}</span>
{#await getUserByIdClient(id)}
    <span>???</span>
{:then user}
    <a href="/user/{user.id}" target="_self">
        <span>{user.username}</span>
    </a>
{:catch error}
    <span>Unknown user</span>
{/await}

<style>
    a {
        display: inline;
        font-weight: bold;
        padding: 4px;
        transition: background-color 0.3s;
    }

    a:hover {
        background-color: rgba(245, 245, 245, 0.5);
        color: black;
    }
</style>