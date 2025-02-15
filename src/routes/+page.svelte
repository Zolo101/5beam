<script lang="ts">
    import LevelComponent from "../components/browse/LevelComponent.svelte";
    import LevelpackComponent from "../components/browse/LevelpackComponent.svelte";
    import Button from "../components/Button.svelte";
    import Pagination from "../components/Pagination.svelte";
    import { getLevelPageClient } from "../client/ClientSideAPI";
    import { writable } from "svelte/store";
    import homepageVideo from "$lib/assets/5beam_homepage_video.webm";
    import type { PageData } from "./$types";
    import UserComponent from "../components/UserComponent.svelte";

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
</script>

<svelte:head>
    <meta property="og:title" content="5beam" />
    <meta
        property="og:description"
        content="5beam allows you to upload, share, and play BFDIA 5b levels you've made!"
    />
    <meta property="og:image" content="https://5beam.zelo.dev/box.png" />
</svelte:head>

<section class="mx-5 flex pt-2 max-md:flex-col">
    <section class="flex w-1/2 flex-col justify-center max-md:w-full max-md:pb-2">
        <p class="p-5 text-center text-3xl">
            5beam allows you to upload, share, and play BFDIA 5b levels you've made!
        </p>
        <div class="flex flex-wrap justify-center gap-4 max-sm:flex-col max-sm:items-center">
            <Button
                text="Play BFDIA 5b!"
                bg="#4ade80"
                href="https://coppersalts.github.io/HTML5b/"
            />
            {#if data.loggedIn}
                <Button text="Upload a level" bg="#38bdf8" href="/upload" />
            {/if}
            <Button text="Join our discord!" bg="#5865f2" href="https://discord.gg/qtePFSH" />
        </div>
    </section>
    <aside>
        <video
            width="960"
            height="540"
            class="rounded shadow-2xl shadow-white/20 outline outline-2 outline-white/5"
            src={homepageVideo}
            autoplay
            muted
            loop
        />
        <section class="text-sm">
            <a class="hover:underline" href="/level/defmxfn312m41c3">Autobook 2</a><span
                class="pl-1">by</span
            ><UserComponent prefix="" user={{ id: "6cmdcntll4sgnzz", username: "coppersalts" }} />
        </section>
    </aside>
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
    class="mx-auto mb-2 flex max-w-[700px] items-center justify-evenly rounded bg-yellow-400/20 p-3 backdrop-blur-lg backdrop-saturate-200"
>
    <!--                    <p class="text-7xl text-blue-500 top-[85px] absolute -z-10 text-opacity-50 italic font-extrabold">?</p>-->
    <span class="text-3xl font-bold text-yellow-300">Bored?</span>
    <a
        href="/random"
        class="text-center text-xl text-yellow-100 hover:cursor-pointer hover:underline"
        >Click here to view a random level!</a
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

<style>
    .pagination {
        @apply m-auto flex flex-wrap justify-center gap-4;
    }
</style>
