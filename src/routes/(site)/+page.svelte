<script lang="ts">
    import LevelComponent from "../../components/browse/LevelComponent.svelte";
    import LevelpackComponent from "../../components/browse/LevelpackComponent.svelte";
    import Button from "../../components/Button.svelte";
    import Pagination from "../../components/Pagination.svelte";
    import { getLevelPageClient } from "../../client/ClientSideAPI";
    import { writable } from "svelte/store";
    import homepageVideo from "$lib/assets/5beam_homepage_video.webm";
    import type { PageData } from "../../../.svelte-kit/types/src/routes";
    import UserComponent from "../../components/UserComponent.svelte";
    import { getLevelThumbnailURL, getPlaysString } from "../../misc";
    import Icon from "../../components/Icon.svelte";
    import Difficulty from "../../components/Difficulty.svelte";

    export let data: PageData;
    let user = data.user;

    $: recentLevelPage = 1;
    $: featuredLevelPage = 1;
    $: mostPopularLevelPage = 1;
    $: levelpackPage = 1;
    const recentLevels = writable(data.recentLevels);
    const featuredLevels = writable(data.featuredLevels);
    const mostPopularLevels = writable(data.mostPopularLevels);
    const levelpacks = writable(data.levelpacks);
    const { level: dailyLevel } = data.daily[0].expand;
    const dailyLevelCreator = dailyLevel.expand.creator;
    // console.log(dailyLevel, dailyLevelCreator);

    const description = "Play, share and upload BFDIA 5b levels!";

    const b = getLevelThumbnailURL(dailyLevel.id, dailyLevel.thumbnail, false);
</script>

<svelte:head>
    <meta property="og:title" content="5beam" />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="https://5beam.zelo.dev/box.png" />
</svelte:head>

<section class="mx-5 flex pt-2 max-md:flex-col">
    <section class="flex w-1/2 flex-col justify-center max-md:w-full max-md:pb-2">
        <p class="p-5 text-center text-3xl font-bold">{description}</p>
        <div class="flex flex-wrap justify-center gap-4 max-sm:flex-col max-sm:items-center">
            <Button
                text="Play BFDIA 5b!"
                bg="#4ade80"
                href="https://coppersalts.github.io/HTML5b/"
            />
            {#if data.loggedIn}
                <Button text="Upload a level" bg="#38bdf8" href="/upload" />
            {/if}
            <Button
                text="Join the 5b discord!"
                bg="#5865f2"
                href="https://discord.gg/qtePFSH"
                event="discord-join"
            />
        </div>
    </section>
    <aside class="perspective-near transform-3d *:-translate-x-5 *:-rotate-y-2">
        <video
            width="960"
            height="540"
            class="rounded-sm shadow-2xl shadow-white/20 outline outline-2 outline-white/5"
            src={homepageVideo}
            autoplay
            muted
            loop
        />
        <section class="text-2xl">
            <a class="hover:underline" href="/level/defmxfn312m41c3">Autobook 2</a><span
                class="pl-1">by</span
            ><UserComponent prefix="" user={{ id: "6cmdcntll4sgnzz", username: "coppersalts" }} />
        </section>
    </aside>
</section>

<div class="m-2 flex items-center gap-2 pl-10 text-4xl font-bold">
    <p class=" w-min rounded bg-gradient-to-b from-orange-400 to-yellow-500 p-2 text-black/90">
        NEW!
    </p>
    <p class="">Daily Level</p>
</div>
<section class="mx-10 flex gap-5 max-lg:flex-col">
    <section
        class="flex grow gap-2 rounded-sm bg-gradient-to-b from-green-500/70 to-green-700/50 p-3 outline-2 outline-green-400/90"
    >
        <img class="w-1/2 rounded-xs object-cover" src={b} alt="Level Thumbnail" />
        <div class="flex w-full flex-col gap-2 p-2">
            <div>
                <span class="text-center text-4xl font-bold">{dailyLevel.title}</span>
                <UserComponent prefix="by" user={dailyLevelCreator} />
            </div>
            <p class="grow">{dailyLevel.description}</p>
            <div class="flex w-full justify-around gap-2">
                <div class="text-3xl font-bold">
                    <Difficulty difficulty={dailyLevel.difficulty} includeText />
                </div>
                <div class="inline text-2xl font-bold text-green-500">
                    <Icon name="plays" width="26" height="26" />
                    <span class="drop-shadow-sm">{getPlaysString(dailyLevel.plays)}</span>
                </div>
            </div>
            <div class="**:w-full">
                <Button
                    text="Play!"
                    bg="#4bff5d"
                    href="https://coppersalts.github.io/HTML5b?level={dailyLevel.id}"
                    event="play-level-daily"
                    disabled={dailyLevel.modded}
                />
            </div>
        </div>
    </section>
    <section
        class="min-h-full content-center rounded-sm bg-gradient-to-b from-emerald-500/50 to-emerald-700/50 p-3 text-center text-4xl font-bold text-emerald-100 outline-2 outline-emerald-400/90"
    >
        <p>Weekly challenges coming soon!</p>
    </section>
</section>

<h2>Featured Levels</h2>
<Pagination
    bind:page={featuredLevelPage}
    bind:output={$featuredLevels}
    callback={(page, sort, featured) => getLevelPageClient(page, 0, 0, 1)}
    removeOptions
>
    <section class="pagination">
        {#each $featuredLevels as featuredLevel}
            <LevelComponent level={featuredLevel} />
        {/each}
    </section>
</Pagination>

<section
    class="mx-auto mb-2 flex max-w-[700px] items-center justify-evenly rounded-sm bg-yellow-400/20 p-3 backdrop-blur-lg backdrop-saturate-200"
>
    <!--                    <p class="text-7xl text-blue-500 top-[85px] absolute -z-10 text-opacity-50 italic font-extrabold">?</p>-->
    <span class="text-3xl font-bold text-yellow-300">Bored?</span>
    <a
        href="/random"
        class="text-center text-xl text-yellow-100 hover:cursor-pointer hover:underline"
        >Click here for random levels!</a
    >
</section>

<h2>Recent Levels</h2>
<Pagination
    bind:page={recentLevelPage}
    bind:output={$recentLevels}
    callback={(page, sort, featured) => getLevelPageClient(page, 0, sort, featured)}
    removeOptions
>
    <section class="pagination">
        {#each $recentLevels as level}
            <LevelComponent {level} />
        {/each}
    </section>
</Pagination>

<h2>Most Popular Levels</h2>
<Pagination
    bind:page={mostPopularLevelPage}
    bind:output={$mostPopularLevels}
    callback={(page, sort, featured) => getLevelPageClient(page, 0, 2, featured)}
    removeOptions
>
    <section class="pagination">
        {#each $mostPopularLevels as mostPopularLevel}
            <LevelComponent level={mostPopularLevel} />
        {/each}
    </section>
</Pagination>

<h2>Recent Levelpacks</h2>
<Pagination
    bind:page={levelpackPage}
    bind:output={$levelpacks}
    callback={(page, sort, featured) => getLevelPageClient(page, 1, sort, featured)}
    removeOptions
>
    <section class="pagination">
        {#each $levelpacks as levelpack}
            <LevelpackComponent {levelpack} />
        {/each}
    </section>
</Pagination>
