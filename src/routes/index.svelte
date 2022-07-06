<script lang="ts">
    import LevelpackComponent from "../components/browse/LevelpackComponent.svelte";
    import { getLevelPageClient } from "../components/ClientSideAPI";

    $: page = 0
    $: levelsRequest = getLevelPageClient(page, 16);

    const changePage = (by: number) => {
        // dont go below zero
        page = (page + by < 0 ? 0 : page + by);
    }
</script>

<div class="levelpacks">
    {#await levelsRequest}
        <p>Loading...</p>
    {:then levels}
        {#each levels as level}
            <a href="level/{level.id}">
                <LevelpackComponent {level}/>
            </a>
        {/each}
    {:catch error}
        <p>Error while requesting levels: {error}</p>
    {/await}
</div>
<div class="pag"> <!-- pagination -->
    <span class="pag-arrow" on:click={() => changePage(-1)}>{"<"}</span>
    <span class="pag-number">{page}</span>
    <span class="pag-arrow" on:click={() => changePage(1)}>{">"}</span>
</div>

<style>
    a {
        color: inherit;
        text-decoration: none;
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