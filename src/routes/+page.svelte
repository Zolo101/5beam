<script lang="ts">
    import LevelComponent from "../components/browse/LevelComponent.svelte";
    import LevelpackComponent from "../components/browse/LevelpackComponent.svelte";
    import Button from "../components/Button.svelte";
    import Pagination from "../components/Pagination.svelte";
    import { getLevelPageClient } from "../client/ClientSideAPI";
    import { writable } from "svelte/store";
    import type { PageData } from "./$types";

    export let data: PageData;
    let user = data.user;

    $: levelPage = 1
    $: levelpackPage = 1
    const levels = writable(data.levels)
    const levelpacks = writable(data.levelpacks)
</script>

<svelte:head>
    <meta property="og:title" content="5beam"/>
    <meta name="description" content="Level Database for the web game BFDIA 5b.">
    <meta property="og:description" content="Level Database for the web game BFDIA 5b."/>
</svelte:head>

{#if data.loggedIn}
    <p class="text-3xl text-center p-5">5beam is a website that allows you to upload, share, and play BFDIA 5b levels you've made!</p>
    <div class="flex gap-4 justify-center">
        <Button text="Play BFDIA 5b!" bg="#4ade80" href="https://coppersalts.github.io/HTML5b/"/>
        <Button text="Upload a level" bg="#38bdf8" href="/upload"/>
        <Button text="Join our discord!" bg="#5865f2" href="https://discord.gg/qtePFSH"/>
    </div>
{:else}
    <p class="text-3xl text-center p-5">5beam is a website that allows you to upload, share, and play BFDIA 5b levels you've made! To upload levels, log in via discord!</p>
    <div class="flex gap-4 justify-center">
        <Button text="Play BFDIA 5b!" bg="#4ade80" href="https://coppersalts.github.io/HTML5b/"/>
        <Button text="Join our discord!" bg="#5865f2" href="https://discord.gg/qtePFSH"/>
    </div>
{/if}

<br><br>
<p class="text-4xl text-neutral-300 font-bold p-2">Recent Levels</p>
    <Pagination
            bind:page={levelPage}
            bind:output={$levels}
            callback={(page) => getLevelPageClient(page, 8, 0)}
    >
        <div class="flex flex-wrap m-auto gap-4 max-w-[900px]">
            {#each $levels as level}
                <LevelComponent {level}/>
            {/each}
        </div>
    </Pagination>
<br>
<p class="text-4xl text-neutral-300 font-bold p-2">Recent Levelpacks</p>
<Pagination
        bind:page={levelpackPage}
        bind:output={$levelpacks}
        callback={(page) => getLevelPageClient(page, 8, 1)}
>
    <div class="flex flex-wrap m-auto gap-4 max-w-[900px]">
        {#each $levelpacks as levelpack}
            <LevelpackComponent {levelpack}/>
        {/each}
    </div>
</Pagination>
