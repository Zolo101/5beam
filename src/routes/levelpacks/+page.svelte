<script lang="ts">
    import { getLevelPageClient } from "../../client/ClientSideAPI";
    import LevelpackComponent from "../../components/browse/LevelpackComponent.svelte";

    $: levelPage = 0
    $: levelpacksRequest = getLevelPageClient(page, 8, 1);

    const changePage = (by: number) => {
        // dont go below zero
        page = (page + by < 0 ? 0 : page + by);
    }
</script>

<div class="levelpacks">
    {#await levelpacksRequest}
        <p>Loading...</p>
    {:then levelpacks}
        {#each levelpacks as levelpack}
            <a href="levelpack/{levelpack.id}">
                <LevelpackComponent {levelpack}/>
            </a>
        {/each}
    {:catch error}
        <p>Error while requesting levelpacks: {error}</p>
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