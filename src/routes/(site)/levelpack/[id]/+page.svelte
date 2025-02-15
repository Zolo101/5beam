<script lang="ts">
    import type { PageData } from "../../../../../.svelte-kit/types/src/routes";
    import UserComponent from "../../../../components/UserComponent.svelte";
    import Button from "../../../../components/Button.svelte";
    import { getLevelpackClient } from "../../../../client/ClientSideAPI";
    import LevelComponent from "../../../../components/browse/LevelComponent.svelte";
    import Box from "$lib/assets/box.png";
    import { formatDate_Day } from "../../../../misc";
    import Difficulty from "../../../../components/Difficulty.svelte";
    // import Difficulty from "../../../components/Difficulty.svelte";
    export let data: PageData;

    let levelpack = data.levelpack;
    let user = data.levelpack.creator;
    // let expanded = false;

    const levels = getLevelpackClient(levelpack.id, 1);
    // .then((res) => {
    //     levelpack = res;
    // expanded = true;
    // })

    // const thumbnailUrl = getLevelThumbnailURL(levelpack.id, levelpack.thumbnail)

    const downloadLevel = () => {
        alert("WIP");
        // const a = document.createElement("a");
        // const blob = new Blob([levelpack.data], {type: "text/plain"});
        // const url = URL.createObjectURL(blob);
        //
        // a.setAttribute("href", url);
        // a.setAttribute("download", `levels.txt`);
        //
        // a.click()
    };

    const viewLevels = () => {
        getLevelpackClient(levelpack.id, 1).then((res) => {
            levelpack = res;
            // expanded = true;
        });
    };
</script>

<svelte:head>
    <title>{levelpack.title} - 5beam</title>
    <meta property="og:title" content={levelpack.title} />
    <meta property="og:description" content={levelpack.description} />
    <meta property="og:image" content={Box} />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="mt-2 flex flex-col text-neutral-100 max-xl:items-center xl:mx-48">
    <p
        class="mb-1 text-6xl font-bold max-sm:text-center"
        style:color={levelpack.featured ? "#ffea65" : "#f5f5f5"}
    >
        {levelpack.title}
    </p>
    <!--    TODO: Add star icon for featured levels? -->
    <section class="eee flex text-xl max-md:flex-col max-md:text-xs">
        <span class="text-xl"><UserComponent prefix="by" {user} /></span>
        <span class="px-1">::</span>
        <span class="font-black"
            ><Difficulty includeText includeImage={false} difficulty={levelpack.difficulty} /></span
        >
        <span class="px-1">::</span>
        <span class="pr-1 font-black text-purple-500">{levelpack.levels.length}</span>
        <span class="text-purple-500">levels</span>
        <span class="px-1">::</span>
        <span class="pr-1 font-black text-green-500">{levelpack.plays}</span>
        <span class="text-green-500">plays</span>
        <span class="px-1">::</span>
        <span class="font-black text-amber-500">{formatDate_Day(levelpack.created)}</span>
    </section>
</section>
<div class="flex flex-row justify-center gap-5 pt-5 max-lg:flex-col">
    <Button
        text="Play"
        bg="#4bff5d"
        href="https://coppersalts.github.io/HTML5b?levelpack={levelpack.id}"
        disabled={levelpack.modded}
    />
    <Button text="Download (WIP)" bg="#4bffff" onclick={downloadLevel} disabled />
</div>
<p class="pt-5 pl-2.5 text-4xl font-bold text-neutral-300">Description</p>
<p class="p-5 text-2xl">{levelpack.description}</p>
<p class="pt-5 pl-2.5 text-4xl font-bold text-neutral-300">Levels included</p>
<div class="flex flex-wrap justify-center gap-4 pt-5">
    {#await levels}
        <div class="m-auto">
            <p>Loading...</p>
        </div>
    {:then ls}
        {#each ls.levels as level}
            <LevelComponent {level} />
        {/each}
    {/await}
</div>
