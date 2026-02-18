<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "$lib/components/UserComponent.svelte";
    import { formatDate_Day, getLevelThumbnailURL, getPlaysString, safeJsonLd } from "$lib/misc";
    import BigButton from "$lib/components/BigButton.svelte";

    import Carousel from "$lib/components/Carousel.svelte";
    import Featured from "$lib/assets/icons/Featured.svg?component";
    import LevelListComponent from "$lib/components/browse/LevelListComponent.svelte";
    import Report from "$lib/components/Report.svelte";
    import Star from "$lib/components/Star.svelte";

    import Levels from "$lib/assets/icons/Levels.svg?component";
    import Plays from "$lib/assets/icons/Plays.svg?component";
    import StarEnabled from "$lib/assets/icons/starEnabled.svg?component";

    const { data }: { data: PageData } = $props();

    let { levelpack, user, starred } = $derived(data);

    let {
        id,
        title,
        description,
        plays,
        featured,
        creator,
        modded,
        created,
        updated,
        levels,
        stars
    } = $derived(levelpack);

    const creatorName = $derived(creator?.username ?? "Guest");
    const originalLevelpackFileData = $derived(levels.map((level) => level.data).join("\n\n"));
    const levelpackImage = $derived(
        levels.length > 0
            ? getLevelThumbnailURL((levels[0] as any).id, (levels[0] as any).thumbnail, false)
            : "https://5beam.zelo.dev/box.png"
    );

    function downloadLevelpack() {
        const a = document.createElement("a");
        const blob = new Blob([originalLevelpackFileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        a.setAttribute("href", url);
        a.setAttribute("download", `levels.txt`);

        a.click();
    }

    function deleteLevelpack() {
        console.log("deleteLevelpack");
    }

    let isOwner = $derived(creator?.id === user?.record.id);

    const jsonLd = $derived(
        safeJsonLd({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            description: description,
            image: levelpackImage,
            author: { "@type": "Person", name: creatorName },
            dateCreated: created,
            dateModified: updated,
            interactionStatistic: {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/PlayAction",
                userInteractionCount: plays
            },
            hasPart: (levels as any[]).map((level: any, i: number) => ({
                "@type": "CreativeWork",
                position: i + 1,
                name: level.title,
                image: getLevelThumbnailURL(level.id, level.thumbnail, false),
                dateCreated: level.created,
                dateModified: level.updated,
                interactionStatistic: {
                    "@type": "InteractionCounter",
                    interactionType: "https://schema.org/PlayAction",
                    userInteractionCount: level.plays
                }
            }))
        })
    );
</script>

<svelte:head>
    <title>{title} - 5beam</title>
    <meta property="og:title" content={title + " by " + creatorName} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={levelpackImage} />
    <meta name="description" content={description} />
    <meta name="twitter:card" content="summary_large_image" />
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<section class="mt-2 flex flex-col max-xl:items-center xl:mx-48">
    <div class="flex items-baseline justify-between gap-2">
        <div class="flex items-baseline gap-3">
            {#if featured}
                <Featured width="56" height="56" />
            {/if}
            <span class="mb-1 text-6xl font-bold max-sm:text-center" class:featured>
                {title}
            </span>
            {#if user}
                <Star bind:stars bind:starred width="48" height="48" {id} type="1" />
            {/if}
        </div>
        <Report kind="levelpack" />
    </div>
    <section class="flex items-baseline gap-10 text-xl font-bold">
        <span class="text-xl"><UserComponent prefix="by" {creator} /></span>

        <span>
            <Levels width="13" height="13" />
            <span class="text-purple-500">
                {levels.length}
            </span>
        </span>
        <span>
            <Plays width="13" height="13" />
            <span class="text-green-500">
                {getPlaysString(plays)}
            </span>
        </span>
        <span>
            <StarEnabled width="15" height="15" />
            <span class="text-yellow-500">
                {getPlaysString(stars)}
            </span>
        </span>
        <span>{formatDate_Day(created)}</span>
    </section>
</section>
<div class="flex justify-center gap-5 py-6">
    <Carousel height={540} width={960} {levels} showIndex autoPlay />
    <div class="flex w-1/5 flex-col justify-center gap-5 text-3xl font-bold">
        <BigButton
            text="Play"
            bg="#4bff5d"
            href="https://coppersalts.github.io/HTML5b?levelpack={id}"
            event="play-level"
            disabled={!!modded}
        />
        {#if isOwner || data.admin}
            <BigButton text="Edit" bg="#a8ff00" href="/edit/levelpack/{id}" event="edit-level" />
        {/if}
        <BigButton
            text="Download"
            bg="#4bffff"
            onclick={downloadLevelpack}
            event="download-level"
        />
    </div>
</div>

{#if description}
    <p class="pt-5 pl-2.5 text-4xl font-bold text-neutral-300">Description</p>
    <p class="m-2 rounded-lg bg-neutral-800/90 p-3 text-2xl whitespace-pre-wrap backdrop-blur-sm">
        {levelpack.description}
    </p>
{/if}
<p class="pt-5 pl-2.5 text-4xl font-bold text-neutral-300">Levels included</p>
<div class="flex flex-wrap justify-center gap-4 pt-5">
    {#each levels as level}
        <LevelListComponent data={level} />
    {/each}
</div>
