<script lang="ts">
    import { getLevelPageClient } from "../components/ClientSideAPI";
    import LevelComponent from "../components/browse/LevelComponent.svelte";

    $: page = 0
    $: levelsRequest = getLevelPageClient(page, 8);

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
                <LevelComponent {level}/>
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