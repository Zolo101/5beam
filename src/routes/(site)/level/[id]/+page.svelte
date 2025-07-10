<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "../../../../components/UserComponent.svelte";
    import Button from "../../../../components/Button.svelte";
    import Difficulty from "../../../../components/Difficulty.svelte";
    import { apiURL, formatDate_Day, getLevelThumbnailURL } from "../../../../misc";
    import Icon from "../../../../components/Icon.svelte";
    import LevelComponent from "../../../../components/browse/LevelComponent.svelte";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let { level, relatedLevels, user: clientUser } = $derived(data);
    let {
        id,
        title,
        description,
        thumbnail,
        difficulty,
        plays,
        featured,
        creator,
        modded,
        created
    } = $derived(level);
    const thumbnailUrl = $derived(getLevelThumbnailURL(id, thumbnail));

    let isOwner = creator.discordId === clientUser?.id;

    const downloadLevel = () => {
        const a = document.createElement("a");
        const blob = new Blob([level.data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        a.setAttribute("href", url);
        a.setAttribute("download", `levels.txt`);

        a.click();
    };

    const deleteLevel = async () => {
        const confirm = prompt(
            "Are you sure you want to delete this level? Type the level name to confirm."
        );
        if (confirm !== level.title) return;

        await fetch(`${apiURL}/api/admin/delete?id=${level.id}`, {
            method: "POST"
        });
    };
</script>

<svelte:head>
    <title>{title} - 5beam</title>
    <meta property="og:title" content={title + " by " + creator.username} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={thumbnailUrl} />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="mt-2 flex flex-col text-neutral-100 max-xl:items-center xl:mx-48">
    <p
        class="mb-1 text-6xl font-bold max-sm:text-center"
        style:color={featured ? "#ffea65" : "#f5f5f5"}
    >
        <Icon name="starred" width="56" height="56" />
        {title}
    </p>
    <!--    TODO: Add star icon for featured levels? -->
    <section class="flex text-xl max-md:flex-col max-md:text-xs">
        <span class="text-xl"><UserComponent prefix="by" {creator} /></span>
        <span class="px-1">::</span>
        <span class="font-black"><Difficulty includeText includeImage={false} {difficulty} /></span>
        <span class="px-1">::</span>
        <span class="pr-1 font-black text-green-500">{plays}</span>
        <span class="text-green-500">plays</span>
        <span class="px-1">::</span>
        <span class="font-black text-amber-500">{formatDate_Day(created)}</span>
    </section>
</section>
<div class="flex flex-col items-center py-6">
    <img
        class="rounded-sm object-cover shadow-xl"
        width="960"
        height="540"
        src={thumbnailUrl}
        alt="Placeholder Thumbnail"
    />
    <div class="flex gap-5 pt-5 max-lg:flex-col">
        <Button
            text="Play"
            bg="#4bff5d"
            href="https://coppersalts.github.io/HTML5b?level={id}"
            event="play-level"
            disabled={!!modded}
        />
        <Button text="Download" bg="#4bffff" onclick={downloadLevel} event="download-level" />
        {#if isOwner || data.admin}
            <Button text="Edit Level" bg="#a8e000" href="{id}/edit" event="edit-level" />
        {/if}
    </div>
</div>

<p class="pl-2.5 text-4xl font-bold">Description</p>
<p class="p-5 text-2xl">{description}</p>

<p class="pl-2.5 text-4xl font-bold">Similar Levels</p>
<div class="flex flex-wrap gap-5 p-3">
    {#each relatedLevels as level}
        <LevelComponent data={level} />
    {/each}
</div>
