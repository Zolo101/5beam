<script lang="ts">
    import LevelpackComponent from "../components/browse/LevelpackComponent.svelte";
    import { getLevelsClient } from "../components/ClientSideAPI";

    let page = 0
    const levelsRequest = getLevelsClient(`${page}`)
    levelsRequest.then(data => console.log(data))


</script>

<div class="pag"> <!-- pagination -->
    <span class="pag-arrow">{"<"}</span>
    <span class="pag-number">{page}</span>
    <span class="pag-arrow">{">"}</span>
</div>
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