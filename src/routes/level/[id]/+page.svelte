<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "../../../components/UserComponent.svelte";
    import Button from "../../../components/Button.svelte";
    import Difficulty from "../../../components/Difficulty.svelte";
    import { apiURL, formatDate_Day, getLevelThumbnailURL } from "../../../misc";

    export let data: PageData;

    let level = data.level;
    let user = data.level.creator;
    let clientUser = data.user

    let isOwner = user.discordId === clientUser?.id

    const thumbnailUrl = getLevelThumbnailURL(level.id, level.thumbnail)

    const downloadLevel = () => {
        const a = document.createElement("a");
        const blob = new Blob([level.data], {type: "text/plain"});
        const url = URL.createObjectURL(blob);

        a.setAttribute("href", url);
        a.setAttribute("download", `levels.txt`);

        a.click()
    }

    const deleteLevel = async () => {
        const confirm = prompt("Are you sure you want to delete this level? Type the level name to confirm.")
        if (confirm !== level.title) return

        await fetch(`${apiURL}/api/admin/delete?id=${level.id}`, {
            method: "POST"
        })
    }
</script>

<svelte:head>
    <title>{level.title} - 5beam</title>
    <meta property="og:title" content={level.title + " by " + level.creator.username}/>
    <meta property="og:description" content={level.description}/>
    <meta property="og:image" content={thumbnailUrl}/>
    <meta name="twitter:card" content="summary_large_image">
</svelte:head>

<!--<div class="level">-->
<!--    <div class="header">-->
<!--        <span class="title">{level.title}</span>-->
<!--        <Difficulty difficulty={level.difficulty}/>-->
<!--        <User prefix="by" id={level.creator}/>-->
<!--    </div>-->
<!--    <div class="profile">-->
<!--        <div class="main">-->
<!--&lt;!&ndash;            <Star amount={level.stars}/>&ndash;&gt;-->
<!--            <p>{level.description}</p>-->
<!--        </div>-->
<!--        <div class="info">-->
<!--            <Table content={[-->
<!--                ["Created on", formatDate_Full(level.created)],-->
<!--                ["Plays", level.plays],-->
<!--                //["Stars", level.stars],-->
<!--                ["Difficulty", `${difficultyMap.get(level.difficulty)} (${level.difficulty})`],-->
<!--            ]}></Table>-->
<!--            <br>-->
<!--&lt;!&ndash;            <button>Download Levelpack (not working yet)</button>&ndash;&gt;-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->

<section class="flex flex-col max-xl:items-center text-neutral-100 mt-2 xl:mx-48">
    <p class="max-sm:text-center text-6xl font-bold mb-1"  style:color={level.featured ? "#ffea65" : "#f5f5f5"}>{level.title}</p>
<!--    TODO: Add star icon for featured levels? -->
    <section class="max-md:flex-col max-md:text-xs text-xl flex eee">
        <span class="text-xl"><UserComponent prefix="by" {user}/></span>
        <span class="px-1">::</span>
        <span class="font-black"><Difficulty includeText includeImage={false} difficulty={level.difficulty}/></span>
        <span class="px-1">::</span>
        <span class="font-black text-green-500 pr-1">{level.plays}</span>
        <span class="text-green-500">plays</span>
        <span class="px-1">::</span>
<!--        <span class="font-black text-amber-500 pr-1">Uploaded on</span>-->
        <span class="font-black text-amber-500">{formatDate_Day(level.created)}</span>
    </section>
<!--    <tr class="text-5xl">-->
<!--        {#if level.modded} <td class="text-purple-500">{level.modded}</td> {/if}-->
<!--        <td><Difficulty includeText difficulty={level.difficulty}/></td>-->
<!--        <td class="text-green-500">{level.plays}</td>-->
<!--        &lt;!&ndash;                <td class="text-yellow-400">0</td>&ndash;&gt;-->
<!--        <td class="text-amber-500 text-3xl">{formatDate_Day(level.created)}</td>-->
<!--    </tr>-->
</section>
<div class="flex flex-col items-center py-6">
<!--    <img class="rounded-2xl" src="https://via.placeholder.com/720x405" alt="Placeholder Thumbnail"/>-->
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
    <img class="shadow-xl rounded object-cover" width="960" height="540" src={thumbnailUrl} alt="Placeholder Thumbnail"/>
<!--    <div class="my-10 flex-col items-center gap-2.5 inline-flex">-->
        <!--        <div class="w-[707px] h-[69px]"><span class="text-white text-[64px] font-black">Lo</span><span class="text-white text-[64px]">rem Ipsum</span></div>-->
<!--        <div class="text-center">-->
<!--            <p class="w-[350px] text-white text-5xl m-4">{level.title}</p>-->
<!--            <p class="text-white text-2xl"><UserComponent prefix="by" {user}/></p>-->
<!--        </div>-->
<!--    </div>-->
    <div class="flex flex-row max-lg:flex-col gap-5 pt-5">
        <Button text="Play" bg="#4bff5d" href="https://coppersalts.github.io/HTML5b?level={level.id}" disabled={level.modded}/>
        <Button text="Download" bg="#4bffff" onclick={downloadLevel}/>
        {#if isOwner || data.admin}
            <Button text="Edit Level" bg="#a8e000" href="{level.id}/edit"/>
        {/if}
    </div>
    <!--</div>-->
</div>
<!--                            on:mouseover={() => difficultyText = difficultyMap.get(j)}-->
<!--    <div class="flex justify-center p-2 gap-2">-->
<!--        <div class="flex flex-col w-1/4 bg-black/50 rounded-[10px] shadow-2xl">-->
<!--            <div class="p-2 text-center m-auto">-->
<!--&lt;!&ndash;                <span class="text-xl bg-red-600 rounded p-1 font-black">BETA</span>&ndash;&gt;-->
<!--                <p class="text-xl font-bold text-center">Select a difficulty!</p>-->
<!--&lt;!&ndash;                <a href="#">Check out this page if your unsure on what difficulty your level should be!</a>&ndash;&gt;-->
<!--            </div>-->
<!--            <div class="w-full inline-grid justify-items-center items-center align-middle grid-cols-3 p-5">-->
<!--                {#each [0, 1, 2, 3, 4, 5, 6, 7] as j}-->
<!--                    <div-->
<!--                            class="hover:bg-white/20 rounded cursor-pointer transition hover:scale-110 p-1"-->
<!--                            on:click={() => changeDifficulty(j)}-->
<!--                    >-->
<!--                        <Difficulty difficulty={j}/>-->
<!--                    </div>-->
<!--                {/each}-->
<!--            </div>-->
<!--&lt;!&ndash;            TODO: Improve if statement&ndash;&gt;-->
<!--&lt;!&ndash;            {#if difficultyText = "Select a difficulty!"}&ndash;&gt;-->
<!--&lt;!&ndash;                <Button text="Apply" bg="#38e000" onclick={downloadLevel}/>&ndash;&gt;-->
<!--&lt;!&ndash;            {/if}&ndash;&gt;-->
<!--        </div>-->
<!--        <div class="flex flex-col justify-center p-5 gap-6 bg-black/50 rounded-[10px] shadow-2xl">-->
<!--            <Button text="Update level" bg="#a8e000" onclick={downloadLevel}/>-->
<!--            <Button text="Edit level" bg="#ffe15e" onclick={downloadLevel}/>-->
<!--            <Button text="Edit level" bg="#a8e000" href="{level.id}/edit"/>-->
<!--            <Button text="Delete level" bg="#e00000" onclick={deleteLevel}/>-->
<!--        </div>-->
<!--    </div>-->
<!--<div class="w-full bg-black bg-opacity-50 rounded-[5px] shadow justify-center items-center inline-flex py-3">-->
<!--    <table class="w-[1200px]">-->
<!--        <thead>-->
<!--            <tr>-->
<!--                {#if level.modded} <th>Created for</th> {/if}-->
<!--                <th>Difficulty</th>-->
<!--                <th>Total plays</th>-->
<!--&lt;!&ndash;                <th>Total stars</th>&ndash;&gt;-->
<!--                <th>Created</th>-->
<!--            </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--            <tr class="text-5xl">-->
<!--                {#if level.modded} <td class="text-purple-500">{level.modded}</td> {/if}-->
<!--                <td><Difficulty includeText difficulty={level.difficulty}/></td>-->
<!--                <td class="text-green-500">{level.plays}</td>-->
<!--&lt;!&ndash;                <td class="text-yellow-400">0</td>&ndash;&gt;-->
<!--                <td class="text-amber-500 text-3xl">{formatDate_Day(level.created)}</td>-->
<!--            </tr>-->
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
<p class="text-4xl text-neutral-300 font-bold pl-2.5">Description</p>
<p class="text-2xl p-5">{level.description}</p>

<!--<br>-->
<!--<button>Download as 5b Level</button><Help text="In beta: Not all levelpacks can be converted!"/>-->

<style>
    a {
        @apply text-blue-300;
    }

    a:hover {
        @apply underline;
    }

    th {
        @apply w-64 h-[49px] text-center text-2xl;
    }

    td {
        @apply w-[117.78px] h-[61.29px] text-center p-0;
    }
</style>