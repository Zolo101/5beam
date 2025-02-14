<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "../../../components/UserComponent.svelte";
    import Button from "../../../components/Button.svelte";
    import { getLevelpackClient } from "../../../client/ClientSideAPI";
    import LevelComponent from "../../../components/browse/LevelComponent.svelte";
    import Box from "$lib/assets/box.png";
    import { formatDate_Day } from "../../../misc";
    import Difficulty from "../../../components/Difficulty.svelte";
    // import Difficulty from "../../../components/Difficulty.svelte";
    export let data: PageData;

    let levelpack = data.levelpack;
    let user = data.levelpack.creator;
    // let expanded = false;

    const levels = getLevelpackClient(levelpack.id, 1)
        // .then((res) => {
        //     levelpack = res;
            // expanded = true;
        // })

    // const thumbnailUrl = getLevelThumbnailURL(levelpack.id, levelpack.thumbnail)

    const downloadLevel = () => {
        alert("WIP")
        // const a = document.createElement("a");
        // const blob = new Blob([levelpack.data], {type: "text/plain"});
        // const url = URL.createObjectURL(blob);
        //
        // a.setAttribute("href", url);
        // a.setAttribute("download", `levels.txt`);
        //
        // a.click()
    }

    const viewLevels = () => {
        getLevelpackClient(levelpack.id, 1)
            .then((res) => {
                levelpack = res;
                // expanded = true;
            })
    }
</script>

<svelte:head>
    <title>{levelpack.title} - 5beam</title>
    <meta property="og:title" content={levelpack.title}/>
    <meta property="og:description" content={levelpack.description}/>
    <meta property="og:image" content={Box}/>
    <meta name="twitter:card" content="summary_large_image">
</svelte:head>

<!--<div class="level">-->
<!--    <div class="header">-->
<!--        <span class="title">{levelpack.title}</span>-->
<!--        <Difficulty difficulty={levelpack.difficulty}/>-->
<!--        <User prefix="by" id={levelpack.creator}/>-->
<!--    </div>-->
<!--    <div class="profile">-->
<!--        <div class="main">-->
<!--&lt;!&ndash;            <Star amount={levelpack.stars}/>&ndash;&gt;-->
<!--            <p>{levelpack.description}</p>-->
<!--        </div>-->
<!--        <div class="info">-->
<!--            <Table content={[-->
<!--                ["Created on", formatDate_Full(levelpack.created)],-->
<!--                ["Plays", levelpack.plays],-->
<!--                //["Stars", levelpack.stars],-->
<!--                ["Difficulty", `${difficultyMap.get(levelpack.difficulty)} (${levelpack.difficulty})`],-->
<!--            ]}></Table>-->
<!--            <br>-->
<!--&lt;!&ndash;            <button>Download Levelpack (not working yet)</button>&ndash;&gt;-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->

<section class="flex flex-col max-xl:items-center text-neutral-100 mt-2 xl:mx-48">
    <p class="max-sm:text-center text-6xl font-bold mb-1"  style:color={levelpack.featured ? "#ffea65" : "#f5f5f5"}>{levelpack.title}</p>
    <!--    TODO: Add star icon for featured levels? -->
    <section class="max-md:flex-col max-md:text-xs text-xl flex eee">
        <span class="text-xl"><UserComponent prefix="by" {user}/></span>
        <span class="px-1">::</span>
        <span class="font-black"><Difficulty includeText includeImage={false} difficulty={levelpack.difficulty}/></span>
        <span class="px-1">::</span>
        <span class="font-black text-purple-500 pr-1">{levelpack.levels.length}</span>
        <span class="text-purple-500">levels</span>
        <span class="px-1">::</span>
        <span class="font-black text-green-500 pr-1">{levelpack.plays}</span>
        <span class="text-green-500">plays</span>
        <span class="px-1">::</span>
        <!--        <span class="font-black text-amber-500 pr-1">Uploaded on</span>-->
        <span class="font-black text-amber-500">{formatDate_Day(levelpack.created)}</span>
    </section>
    <!--    <tr class="text-5xl">-->
    <!--        {#if levelpack.modded} <td class="text-purple-500">{levelpack.modded}</td> {/if}-->
    <!--        <td><Difficulty includeText difficulty={levelpack.difficulty}/></td>-->
    <!--        <td class="text-green-500">{levelpack.plays}</td>-->
    <!--        &lt;!&ndash;                <td class="text-yellow-400">0</td>&ndash;&gt;-->
    <!--        <td class="text-amber-500 text-3xl">{formatDate_Day(levelpack.created)}</td>-->
    <!--    </tr>-->
</section>
<!--<div class="flex justify-center pt-20 pb-5">-->
<!--    <img class="rounded-sm h-[256px] mt-16" width="256" height="128" src={Box} alt="Placeholder Thumbnail"/>-->
<!--    <img class="rounded-sm" src="https://via.placeholder.com/720x405" alt="Placeholder Thumbnail"/>-->
<!--    <img class="rounded" width="720" height="405" src={thumbnailUrl} alt="Placeholder Thumbnail"/>-->
    <!--    <div class="bg-neutral-300 w-[480px] h-[270px]"></div>-->
    <!--    <div class="bg-neutral-300 w-[720px] h-[405px]"></div>-->

    <!--<div class="w-[952px] h-[924px] relative bg-white bg-opacity-20 flex-col justify-start items-start inline-flex">-->
    <!--    <div class="justify-center items-center gap-3 inline-flex">-->
    <!--        <div class="w-[45px] h-[0px] relative origin-top-left rotate-180"></div>-->
    <!--        <div class="w-[66px] h-[46px] bg-gradient-to-b from-white to-neutral-600 rounded-[10px] justify-center items-center flex">-->
    <!--            <div class="w-[66px] h-[46px] text-center text-neutral-500 text-[32px] font-bold">0</div>-->
    <!--        </div>-->
    <!--        <div class="w-[45px] h-[0px] relative"></div>-->
    <!--    </div>-->
<!--    <div class="my-10 flex-col items-center gap-2.5 inline-flex">-->
        <!--        <div class="w-[707px] h-[69px]"><span class="text-white text-[64px] font-black">Lo</span><span class="text-white text-[64px]">rem Ipsum</span></div>-->
<!--        <div class="text-center">-->
<!--            <p class="w-[350px] text-white text-5xl m-4">{levelpack.title}</p>-->
<!--            <p class="text-white text-2xl"><UserComponent prefix="by" {user}/></p>-->
<!--        </div>-->
        <div class="flex flex-row max-lg:flex-col justify-center gap-5 pt-5">
            <Button text="Play" bg="#4bff5d" href="https://coppersalts.github.io/HTML5b?levelpack={levelpack.id}" disabled={levelpack.modded}/>
            <Button text="Download (WIP)" bg="#4bffff" onclick={downloadLevel} disabled/>
        </div>
<!--    </div>-->
    <!--</div>-->
<!--</div>-->
<!--<div class="w-full bg-black bg-opacity-50 rounded-[5px] shadow justify-center items-center inline-flex py-3">-->
<!--    <table>-->
<!--        <thead>-->
<!--        <tr>-->
<!--            {#if levelpack.modded} <th>Created for</th> {/if}-->
<!--            <th>Total levels</th>-->
<!--            <th>Total plays</th>-->
<!--&lt;!&ndash;            <th>Total stars</th>&ndash;&gt;-->
<!--            <th>Created</th>-->
<!--        </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--        <tr class="text-5xl">-->
<!--            {#if levelpack.modded} <td class="text-purple-500">{levelpack.modded}</td> {/if}-->
<!--&lt;!&ndash;            <td class="text-neutral-500"><Difficulty includeText difficulty={levelpack.difficulty}/></td>&ndash;&gt;-->
<!--            <td class="text-fuchsia-500">{levelpack.levels.length}</td>-->
<!--            <td class="text-green-500">{levelpack.plays}</td>-->
<!--&lt;!&ndash;            <td class="text-yellow-400">0</td>&ndash;&gt;-->
<!--            <td class="text-amber-500 text-3xl">{formatDate_Day(levelpack.created)}</td>-->
<!--        </tr>-->
<!--        </tbody>-->
<!--    </table>-->
    <!--    <div class="self-stretch justify-center items-center gap-[55px] inline-flex">-->
    <!--        <div class="w-32 h-[98.01px] relative">-->
    <!--            <div class="w-[90px] h-[65px] left-[38px] top-[33.01px] absolute">-->
    <!--                <div class="w-[159.55px] h-[65px] left-[-115px] top-0 absolute text-neutral-500 text-5xl">Unknown</div>-->
    <!--            </div>-->
    <!--            <div class="w-32 h-[49px] left-0 top-0 absolute text-center text-2xl">Difficulty</div>-->
    <!--        </div>-->
    <!--        <div class="w-32 h-[98.01px] relative">-->
    <!--            <div class="w-[90px] h-[65px] left-[38px] top-[33.01px] absolute">-->
    <!--                <div class="w-[159.55px] h-[65px] left-[-115px] top-0 absolute text-right text-green-500 text-5xl">0</div>-->
    <!--            </div>-->
    <!--            <div class="w-32 h-[49px] left-0 top-0 absolute text-center text-2xl">Total plays</div>-->
    <!--        </div>-->
    <!--        <div class="w-[120px] h-[98.73px] relative">-->
    <!--            <div class="w-[86px] h-[65px] pt-px pb-[2.71px] left-[34px] top-[33.73px] absolute justify-start items-center gap-[0.31px] inline-flex">-->
    <!--                <div class="w-[117.78px] h-[61.29px] text-right text-yellow-400 text-5xl">0</div>-->
    <!--            </div>-->
    <!--            <div class="w-[120px] h-[49px] left-0 top-0 absolute text-center text-2xl">Total stars</div>-->
    <!--        </div>-->
    <!--        <div class="w-[129.50px] h-[98.07px] relative">-->
    <!--            <div class="w-[90px] h-[65px] left-[39.50px] top-[33.07px] absolute">-->
    <!--                <div class="w-[159.55px] h-[65px] left-[-115px] top-0 absolute text-right text-fuchsia-500 text-5xl">0</div>-->
    <!--            </div>-->
    <!--            <div class="w-[129px] h-[49px] left-0 top-0 absolute text-center text-2xl">Total levels</div>-->
    <!--        </div>-->
    <!--        <div class="w-[150.50px] h-[94px] relative">-->
    <!--            <div class="w-[150.50px] h-[68px] left-0 top-[26px] absolute text-center text-amber-500 text-4xl">02-2023</div>-->
    <!--            <div class="w-[112.17px] h-[49px] left-[20.10px] top-0 absolute text-center text-2xl">Created</div>-->
    <!--        </div>-->
    <!--    </div>-->
<!--</div>-->
<p class="text-4xl text-neutral-300 font-bold pl-2.5 pt-5">Description</p>
<p class="text-2xl p-5">{levelpack.description}</p>
<p class="text-4xl text-neutral-300 font-bold pl-2.5 pt-5">Levels included</p>
<div class="flex flex-wrap justify-center gap-4 pt-5">
    {#await levels}
        <div class="m-auto">
            <p>Loading...</p>
        </div>
    {:then ls}
        {#each ls.levels as level}
            <LevelComponent {level}/>
        {/each}
    {/await}
    <!--{#if expanded}-->
    <!--{:else}-->
<!--        <div class="m-auto">-->
<!--            <Button text="View Levels" bg="#d5ff4b" onclick={viewLevels}/>-->
<!--        </div>-->
    <!--{/if}-->
</div>

<!--<br>-->
<!--<button>Download as 5b Level</button><Help text="In beta: Not all levelpacks can be converted!"/>-->

<style>
    th {
        @apply w-64 h-[49px] text-center text-2xl;
    }

    td {
        @apply w-[117.78px] h-[61.29px] text-center p-0;
    }
</style>