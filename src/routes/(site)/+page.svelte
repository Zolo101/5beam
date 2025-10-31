<script lang="ts">
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import LevelpackComponent from "$lib/components/browse/LevelpackComponent.svelte";
    import Button from "$lib/components/Button.svelte";
    import Pagination from "$lib/components/Pagination.svelte";
    import { getLevelPageClient, getTrendingLevelPageClient } from "$lib/client/ClientSideAPI";
    import type { PageData } from "./$types";
    import UserComponent from "$lib/components/UserComponent.svelte";
    import { getLevelThumbnailURL, getPlaysString } from "$lib/misc";
    import Icon from "$lib/components/Icon.svelte";
    import Difficulty from "$lib/components/Difficulty.svelte";
    import BigButton from "$lib/components/BigButton.svelte";
    import Carousel from "$lib/components/Carousel.svelte";

    let { data }: { data: PageData } = $props();

    let recentLevelPage = $state(1);

    let featuredLevelPage = $state(1);

    let trendingLevelPage = $state(1);

    let levelpackPage = $state(1);

    let { daily, recentLevels, featuredLevels, trendingLevels, levelpacks } = $derived(data);

    const dailyLevel = $derived(daily[0].level);
    const dailyLevelThumbnail = $derived(
        getLevelThumbnailURL(dailyLevel.id, dailyLevel.thumbnail, false)
    );

    const description = "Play, share and upload BFDIA 5b levels!";
</script>

<svelte:head>
    <meta property="og:title" content="5beam" />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="https://5beam.zelo.dev/box.png" />
</svelte:head>

<section class="mx-5 flex pt-2 max-lg:flex-col">
    <section class="flex flex-col justify-center max-lg:w-full max-lg:pb-2">
        <p class="p-5 text-center text-3xl font-bold">{description}</p>
        <div
            class="mx-10 flex flex-col justify-center gap-4 text-3xl font-bold max-sm:items-center"
        >
            <BigButton
                text="Play BFDIA 5b!"
                bg="#ffaa80"
                href="https://coppersalts.github.io/HTML5b/"
                newWindow
            />
            <div class="flex justify-between gap-4 text-3xl *:grow">
                <BigButton text="Upload a level!" bg="#ffffa8" href="/upload" newWindow />
            </div>
        </div>
    </section>
    <aside>
        <Carousel levels={featuredLevels} autoPlay details />
    </aside>
</section>

<div class="m-2 flex items-center gap-2 pl-10 text-4xl font-bold">
    <p class="p-2">Daily Level (not spooky)</p>
</div>
<section class="mx-10 mb-10 flex gap-5 max-lg:flex-col">
    <section
        class="flex grow gap-2 rounded-sm bg-gradient-to-b from-green-700/50 to-green-900/50 p-3 outline-2 outline-green-400/90 backdrop-blur-md"
    >
        <a class="w-full" href="/level/{dailyLevel.id}">
            <img class="rounded-sm object-cover" src={dailyLevelThumbnail} alt="Level Thumbnail" />
        </a>
        <div class="flex w-full flex-col gap-2 p-2">
            <div>
                <a href="/level/{dailyLevel.id}">
                    <span class="text-center text-4xl font-bold">{dailyLevel.title}</span>
                </a>
                <UserComponent prefix="by" creator={dailyLevel.creator} />
            </div>
            <p class="grow">{dailyLevel.description}</p>
            <div class="flex w-full justify-around gap-2 text-3xl">
                <div class="font-bold">
                    <Difficulty difficulty={dailyLevel.difficulty} includeText />
                </div>
                <div class="inline font-bold text-red-500">
                    <Icon name="plays" width="26" height="26" />
                    <span class="drop-shadow-sm">{getPlaysString(dailyLevel.plays)}</span>
                </div>
            </div>
            <div class="**:w-full **:text-2xl">
                <Button
                    text="Play!"
                    bg="#ffff5d"
                    href="https://coppersalts.github.io/HTML5b?level={dailyLevel.id}"
                    event="play-level-daily"
                    newWindow
                    disabled={!!dailyLevel.modded}
                />
            </div>
        </div>
    </section>
    <!-- <section
        class="min-h-full content-center rounded-sm bg-gradient-to-b from-emerald-500/50 to-emerald-700/50 p-3 text-center text-4xl font-bold text-emerald-100 outline-2 outline-emerald-400/90 backdrop-blur-md"
    >
        <p>Weekly challenges coming soon!</p>
    </section> -->
</section>

<!-- <section
    class="mx-auto mb-4 flex max-w-[900px] items-center justify-evenly rounded-sm bg-indigo-400/20 p-3 backdrop-blur-lg backdrop-saturate-200"
>
    <p
        class="text-opacity-50 absolute top-[85px] -z-10 text-7xl font-extrabold text-blue-500 italic"
    >
        ?
    </p>
    <span class="text-3xl font-bold text-indigo-300">Did you know about 5b mods?</span>
    <a href="/mods" class="text-center text-xl text-indigo-100 hover:cursor-pointer hover:underline"
        >Click here to browse and play them!</a
    >
</section> -->

<h2>Featured Spooky Levels</h2>
<Pagination
    bind:page={featuredLevelPage}
    bind:output={featuredLevels}
    callback={({ page, type, sort, amount }) => getLevelPageClient(page, type, sort, true, amount)}
    removeOptions
    columns={2}
    PageComponent={LevelComponent}
/>

<section
    class="mx-auto mb-4 flex max-w-[700px] items-center justify-evenly rounded-sm bg-yellow-400/20 p-3 backdrop-blur-lg backdrop-saturate-200"
>
    <!--                    <p class="text-7xl text-blue-500 top-[85px] absolute -z-10 text-opacity-50 italic font-extrabold">?</p>-->
    <span class="text-3xl font-bold text-yellow-300">Bored to death?</span>
    <a
        href="/random"
        class="text-center text-xl text-yellow-100 hover:cursor-pointer hover:underline"
        >Click here for random levels!</a
    >
</section>

<h2>Trending Spooky Levels</h2>
<Pagination
    bind:page={trendingLevelPage}
    bind:output={trendingLevels}
    callback={({ page, amount }) => getTrendingLevelPageClient(page, amount)}
    removeOptions
    columns={2}
    PageComponent={LevelComponent}
/>

<h2>Recent Spooky Levels</h2>
<Pagination
    bind:page={recentLevelPage}
    bind:output={recentLevels}
    callback={({ page, sort, amount, featured }) =>
        getLevelPageClient(page, 0, sort, featured, amount)}
    removeOptions
    columns={2}
    PageComponent={LevelComponent}
/>

<h2>Recent Scary Levelpacks</h2>
<Pagination
    bind:page={levelpackPage}
    bind:output={levelpacks}
    callback={({ page, sort, amount, featured }) =>
        getLevelPageClient(page, 1, sort, featured, amount)}
    removeOptions
    columns={2}
    PageComponent={LevelpackComponent}
/>
