<script lang="ts">
    import LevelComponent from "../../../../components/browse/LevelComponent.svelte";
    import { writable } from "svelte/store";
    import { getUserLevelPageClient } from "../../../../client/ClientSideAPI";
    import Pagination from "../../../../components/Pagination.svelte";
    import LevelpackComponent from "../../../../components/browse/LevelpackComponent.svelte";
    import type { PageData } from "../../../../../.svelte-kit/types/src/routes";

    export let data: PageData;

    let user = data.creator;
    const levels = writable(data.levels);
    const levelpacks = writable(data.levelpacks);

    let date = new Date(user.created);
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let year = date.getFullYear();

    $: levelPage = 1;
    $: levelpackPage = 1;
</script>

<svelte:head>
    <meta property="og:title" content={user.username} />
    <meta property="og:description" content="Check out {user.username}'s levels on 5beam!" />
</svelte:head>

<section class="font-bold">
    <p class="text-7xl">{user.username}</p>
    <p class="text-4xl text-amber-500">Joined on {month}-{year}</p>
</section>

<div class="flex flex-col items-center">
    <!--    <div class="w-[952px] h-[307px] justify-center items-center gap-11 inline-flex">-->
    <!--        <img class="w-[213px] h-[213px] rounded-[5px] shadow-sm" src="https://via.placeholder.com/213x213" />-->
    <!--        <div class="flex-col justify-start items-center gap-2.5 inline-flex">-->
    <!--            <div><span class="text-white text-[64px] font-normal">{user.username}</span></div>-->
    <!--            <div class="px-[29.50px] py-[12.13px] bg-black bg-opacity-50 rounded-[5px] shadow-sm justify-center items-center inline-flex">-->
    <!--                <div class="self-stretch justify-center items-center gap-[55px] inline-flex">-->
    <!--                    <div class="w-[129.50px] h-[97px] relative">-->
    <!--                        <div class="w-[129px] h-[49px] left-0 top-0 absolute text-center text-white text-2xl font-normal">Total plays</div>-->
    <!--                        <div class="w-[90px] h-[65px] left-[39.50px] top-[32px] absolute">-->
    <!--                            <div class="w-[159.55px] h-[65px] left-[-115px] top-0 absolute text-right text-green-500 text-5xl font-normal">...</div>-->
    <!--                        </div>-->
    <!--                    </div>-->
    <!--                    <div class="w-[120px] h-[98.73px] relative">-->
    <!--                        <div class="w-[86px] h-[65px] pt-px pb-[2.71px] left-[34px] top-[33.73px] absolute justify-start items-center gap-[0.31px] inline-flex">-->
    <!--                            <div class="w-[117.78px] h-[61.29px] text-right text-yellow-400 text-5xl font-normal">...</div>-->
    <!--                        </div>-->
    <!--                        <div class="w-[120px] h-[49px] left-0 top-0 absolute text-center text-white text-2xl font-normal">Total stars</div>-->
    <!--                    </div>-->
    <!--                    <div class="w-[150.50px] h-[94px] relative">-->
    <!--                        <div class="w-[150.50px] h-[68px] left-0 top-[26px] absolute text-center text-amber-500 text-4xl font-normal">{month}-{year}</div>-->
    <!--                        <div class="w-[112.17px] h-[49px] left-[20.10px] top-0 absolute text-center text-white text-2xl font-normal">Joined</div>-->
    <!--                    </div>-->
    <!--                </div>-->
    <!--            </div>-->
    <!--        </div>-->
    <!--    </div>-->

    <h2>Levels</h2>
    {#if user.levels.length}
        <Pagination
            bind:page={levelPage}
            bind:output={$levels}
            callback={(page, sort, featured) =>
                getUserLevelPageClient(user.id, page, 0, sort, featured)}
        >
            <div class="m-auto flex flex-wrap gap-4">
                {#each $levels as level}
                    <LevelComponent {level} />
                {/each}
            </div>
        </Pagination>
    {:else}
        <p>User has no levels!</p>
    {/if}
    <br />
    <h2>Levelpacks</h2>
    {#if user.levelpacks.length}
        <Pagination
            bind:page={levelpackPage}
            bind:output={$levelpacks}
            callback={(page, sort, featured) =>
                getUserLevelPageClient(user.id, page, 1, sort, featured)}
        >
            <div class="m-auto flex flex-wrap gap-4">
                {#each $levelpacks as levelpack}
                    <LevelpackComponent {levelpack} />
                {/each}
            </div>
        </Pagination>
    {:else}
        <p>User has no levelpacks!</p>
    {/if}
</div>
