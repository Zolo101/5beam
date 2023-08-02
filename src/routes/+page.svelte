<script lang="ts">
    import { getLevelPageClient } from "../client/ClientSideAPI";
    import LevelComponent from "../components/browse/LevelComponent.svelte";
    import Button from "../components/Button.svelte";

    $: page = 0
    $: levelsRequest = getLevelPageClient(page, 8);

    const changePage = (by: number) => {
        // dont go below zero
        page = (page + by < 0 ? 0 : page + by);
    }
</script>

<p class="text-3xl text-center p-5">5beam is a website that allows you to upload, share, and play BFDIA 5b levels you've made!</p>
<div class="flex gap-4 justify-center">
    <Button text="Play BFDIA 5b!" bg="#4ade80"/>
    <Button text="Upload a level" bg="#38bdf8"/>
    <Button text="Join our discord!" bg="#5865f2"/>
</div>

<br><br>
<p class="text-4xl text-neutral-400 font-bold">Recent Levels</p>
<div class="flex flex-wrap gap-4">
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