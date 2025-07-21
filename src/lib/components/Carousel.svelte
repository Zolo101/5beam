<script lang="ts">
    import type { Level } from "$lib/types";
    import { fade, fly, slide } from "svelte/transition";
    import { getLevelThumbnailURL } from "$lib/misc";
    import UserComponent from "./UserComponent.svelte";

    type Props = {
        levels: Level[];
        autoPlay?: boolean;
        details?: boolean;
        showIndex?: boolean;
    };

    const { levels, autoPlay = false, details = false, showIndex = false }: Props = $props();

    let currentIndex = $state(0);
    let maxIndex = $derived(levels.length);
    let currentLevel = $derived(levels[currentIndex]);
    let { id, title, thumbnail, creator, featured } = $derived(currentLevel);

    if (autoPlay) {
        setInterval(() => (currentIndex = (currentIndex + 1) % maxIndex), 7000);
    }
</script>

<div class="relative min-h-[540px]">
    {#if showIndex}
        <span
            class="absolute top-5 right-5 z-10 rounded-lg bg-black/80 p-2 text-center text-2xl font-bold text-white"
            >{currentIndex + 1} / {maxIndex}</span
        >
    {/if}
    {#key id}
        <a
            class="relative top-0 left-0 block rounded-lg"
            href={`/level/${id}`}
            transition:slide={{ axis: "y", duration: 1000 }}
        >
            <img
                class="rounded-lg"
                width="960"
                height="540"
                src={getLevelThumbnailURL(id, thumbnail)}
                alt={title}
            />
        </a>
    {/key}
    {#if details}
        {#key id}
            <div class="mt-2" transition:slide={{ axis: "y", duration: 1000 }}>
                <a href={`/level/${id}`} class:featured class="text-center text-4xl font-bold"
                    >{title}</a
                >
                <UserComponent prefix="by" {creator} />
            </div>
        {/key}
    {/if}
</div>
