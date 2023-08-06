<script lang="ts">
    import LevelComponent from "../../../components/browse/LevelComponent.svelte";
    import { writable } from "svelte/store";
    import { getUserLevelPageClient } from "../../../client/ClientSideAPI";
    import Pagination from "../../../components/Pagination.svelte";
    import LevelpackComponent from "../../../components/browse/LevelpackComponent.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;

    let user = data.creator;
    const levels = writable(data.levels)
    const levelpacks = writable(data.levelpacks)

    let date = new Date(user.created)
    let month = (date.getMonth() + 1).toString().padStart(2, "0")
    let year = date.getFullYear()

    $: levelPage = 1
    $: levelpackPage = 1
</script>

<svelte:head>
    <meta property="og:title" content={user.username}/>
    <meta property="og:description" content="Check out {user.username}'s levels at 5beam!"/>
</svelte:head>

<div class="flex flex-col items-center">
    <div class="w-[952px] h-[307px] justify-center items-center gap-11 inline-flex">
        <img class="w-[213px] h-[213px] rounded-[5px] shadow" src="https://via.placeholder.com/213x213" />
        <div class="flex-col justify-start items-center gap-2.5 inline-flex">
            <div><span class="text-white text-[64px] font-normal">{user.username}</span></div>
            <div class="px-[29.50px] py-[12.13px] bg-black bg-opacity-50 rounded-[5px] shadow justify-center items-center inline-flex">
                <div class="self-stretch justify-center items-center gap-[55px] inline-flex">
                    <div class="w-[129.50px] h-[97px] relative">
                        <div class="w-[129px] h-[49px] left-0 top-0 absolute text-center text-white text-2xl font-normal">Total views</div>
                        <div class="w-[90px] h-[65px] left-[39.50px] top-[32px] absolute">
                            <div class="w-[159.55px] h-[65px] left-[-115px] top-0 absolute text-right text-green-500 text-5xl font-normal">...</div>
                        </div>
                    </div>
                    <div class="w-[120px] h-[98.73px] relative">
                        <div class="w-[86px] h-[65px] pt-px pb-[2.71px] left-[34px] top-[33.73px] absolute justify-start items-center gap-[0.31px] inline-flex">
                            <div class="w-[117.78px] h-[61.29px] text-right text-yellow-400 text-5xl font-normal">...</div>
                        </div>
                        <div class="w-[120px] h-[49px] left-0 top-0 absolute text-center text-white text-2xl font-normal">Total stars</div>
                    </div>
                    <div class="w-[150.50px] h-[94px] relative">
                        <div class="w-[150.50px] h-[68px] left-0 top-[26px] absolute text-center text-amber-500 text-4xl font-normal">{month}-{year}</div>
                        <div class="w-[112.17px] h-[49px] left-[20.10px] top-0 absolute text-center text-white text-2xl font-normal">Joined</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <p class="text-4xl text-neutral-300 font-bold p-2">Recent Levels</p>
    <Pagination
            bind:page={levelPage}
            bind:output={$levels}
            callback={(page) => getUserLevelPageClient(user.id, page, 8, 0)}
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
            callback={(page) => getUserLevelPageClient(user.id, page, 8, 1)}
    >
        <div class="flex flex-wrap m-auto gap-4 max-w-[900px]">
            {#each $levelpacks as levelpack}
                <LevelpackComponent {levelpack}/>
            {/each}
        </div>
    </Pagination>

</div>

<!--<div>-->
<!--    {#await userRequest}-->
<!--        <p class="loading">Loading...</p>-->
<!--    {:then user}-->
<!--        <div class="profile">-->
<!--            <h1>{user.username}</h1>-->
<!--            <h2>Created on {formatDate_Full(user.created)}</h2>-->
<!--        </div>-->
<!--    {:catch error}-->
<!--        <p class="error">Error while requesting user: {error}</p>-->
<!--    {/await}-->
<!--</div>-->

<!--<h1 class="header">Levelpacks</h1>-->
<!--<div class="levelpacks">-->
<!--    {#await userLevelpacksRequest}-->
<!--        <p class="loading">Loading...</p>-->
<!--    {:then levelpacks}-->
<!--        {#each levelpacks as levelpack}-->
<!--            <a href="/levelpack/{levelpack.id}">-->
<!--                <LevelpackComponent {levelpack}/>-->
<!--            </a>-->
<!--        {/each}-->
<!--    {:catch error}-->
<!--        <p class="error">Error while requesting levelpacks: {error}</p>-->
<!--    {/await}-->
<!--</div>-->

<!--<h1 class="header">Levels</h1>-->
<!--<div class="levels">-->
<!--    {#await userLevelsRequest}-->
<!--        <p class="loading">Loading...</p>-->
<!--    {:then levels}-->
<!--        &lt;!&ndash;{@debug levels}&ndash;&gt;-->
<!--        {#each levels as level}-->
<!--            <a href="/level/{level.id}">-->
<!--                <LevelComponent {level}/>-->
<!--            </a>-->
<!--        {/each}-->
<!--    {:catch error}-->
<!--        <p class="error">Error while requesting levels: {error}</p>-->
<!--    {/await}-->
<!--</div>-->


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