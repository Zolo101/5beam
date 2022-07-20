<script lang="ts">
    import { getUserByIdClient, getUserLevelPageClient } from "../../components/client/ClientSideAPI";
    import LevelpackComponent from "../../components/browse/LevelComponent.svelte";
    import { page } from "$app/stores";

    const ID = Number($page.params.id)
    $: userRequest = getUserByIdClient(ID)
    $: levels_page = 0 // known as page
    $: userLevelsRequest = getUserLevelPageClient(ID, levels_page, 16);

    const changePage = (by: number) => {
        // dont go below zero
        levels_page = (levels_page + by < 0 ? 0 : levels_page + by);
    }
</script>

<div>
    {#await userRequest}
        <p class="loading">Loading...</p>
    {:then user}
        <div class="profile">
            <h1>{user.name}</h1>
            <h1>Created on {user.createdAt}</h1>
        </div>
    {:catch error}
        <p class="error">Error while requesting user: {error}</p>
    {/await}
</div>
<div class="levelpacks">
    {#await userLevelsRequest}
        <p class="loading">Loading...</p>
    {:then levels}
        {#each levels as level}
            <a href="/level/{level.id}">
                <LevelpackComponent {level}/>
            </a>
        {/each}
    {:catch error}
        <p class="error">Error while requesting levels: {error}</p>
    {/await}
</div>
<div class="pag"> <!-- pagination -->
    <span class="pag-arrow" on:click={() => changePage(-1)}>{"<"}</span>
    <span class="pag-number">{levels_page}</span>
    <span class="pag-arrow" on:click={() => changePage(1)}>{">"}</span>
</div>

<style>
    a {
        color: inherit;
        text-decoration: none;
    }

    .profile {
        color: whitesmoke;
    }

    .levelpacks {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
        grid-auto-rows: 1fr;
        grid-gap: 30px;
    }

    .pag {
        text-align: center;
        font-size: 3rem;
        margin-bottom: 30px;
        color: lightgrey;
    }

    .pag-arrow {
        font-weight: bold;
    }

    .pag-arrow:hover {
        cursor: pointer;
    }
</style>