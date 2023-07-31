<script lang="ts">
    import { getUserByIdClient, getUserLevelPageClient } from "../../../components/client/ClientSideAPI";
    import LevelpackComponent from "../../../components/browse/LevelpackComponent.svelte";
    import { page } from "$app/stores";
    import { formatDate_Full } from "../../../misc";
    import LevelComponent from "../../../components/browse/LevelComponent.svelte";

    const id = $page.params.id
    $: userRequest = getUserByIdClient(id)
    $: levels_page = 0 // known as page
    $: userLevelsRequest = getUserLevelPageClient(id, levels_page, 16, 0);
    $: userLevelpacksRequest = getUserLevelPageClient(id, 0, 32, 1);

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
            <h1>{user.username}</h1>
            <h2>Created on {formatDate_Full(user.created)}</h2>
        </div>
    {:catch error}
        <p class="error">Error while requesting user: {error}</p>
    {/await}
</div>

<h1 class="header">Levelpacks</h1>
<div class="levelpacks">
    {#await userLevelpacksRequest}
        <p class="loading">Loading...</p>
    {:then levelpacks}
        {#each levelpacks as levelpack}
            <a href="/levelpack/{levelpack.id}">
                <LevelpackComponent {levelpack}/>
            </a>
        {/each}
    {:catch error}
        <p class="error">Error while requesting levelpacks: {error}</p>
    {/await}
</div>

<h1 class="header">Levels</h1>
<div class="levels">
    {#await userLevelsRequest}
        <p class="loading">Loading...</p>
    {:then levels}
        <!--{@debug levels}-->
        {#each levels as level}
            <a href="/level/{level.id}">
                <LevelComponent {level}/>
            </a>
        {/each}
    {:catch error}
        <p class="error">Error while requesting levels: {error}</p>
    {/await}
</div>


<!--<div class="pag"> &lt;!&ndash; pagination &ndash;&gt;-->
<!--    <span class="pag-arrow" on:click={() => changePage(-1)}>{"<"}</span>-->
<!--    <span class="pag-number">{levels_page}</span>-->
<!--    <span class="pag-arrow" on:click={() => changePage(1)}>{">"}</span>-->
<!--</div>-->

<style>
    a {
        color: inherit;
        text-decoration: none;
    }

    h1, h2 {
        color: whitesmoke;
    }

    .header {
        text-align: center;
    }

    .levels, .levelpacks {
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