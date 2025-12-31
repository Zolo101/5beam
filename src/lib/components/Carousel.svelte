<script lang="ts">
    import type { Level } from "$lib/types";
    import { fly } from "svelte/transition";
    import { getLevelThumbnailURL } from "$lib/misc";
    import UserComponent from "./UserComponent.svelte";

    type Props = {
        levels: Level[];
        autoPlay?: boolean;
        details?: boolean;
        showIndex?: boolean;
        width?: number;
        height?: number;
    };

    const {
        levels,
        autoPlay = false,
        details = false,
        showIndex = false,
        width = 960,
        height = 540
    }: Props = $props();

    let currentIndex = $state(0);
    let maxIndex = $derived(levels.length);
    let currentLevel = $derived(levels[currentIndex]);
    let { id, title, thumbnail, creator, featured } = $derived(currentLevel);

    // TODO: maybe address this but we dont really need this to be stateful
    // svelte-ignore state_referenced_locally
    if (autoPlay) {
        setInterval(() => (currentIndex = (currentIndex + 1) % maxIndex), 7000);
    }

    let duration = 3000;
</script>

<div class="relative overflow-hidden rounded-lg" style="width: {width}px; height: {height}px;">
    {#if showIndex}
        <span
            class="absolute top-5 right-5 z-10 rounded-lg bg-black/80 p-2 text-center text-2xl font-bold text-white"
            >{currentIndex + 1} / {maxIndex}</span
        >
    {/if}
    {#key id}
        <a
            class="absolute top-0 left-0 w-full rounded-lg"
            href={`/level/${id}`}
            in:fly={{ x: width, duration: duration / 1.5, opacity: 1 }}
            out:fly={{ x: -width, duration, opacity: 1 }}
        >
            <img
                class="rounded-lg"
                {width}
                {height}
                src={getLevelThumbnailURL(id, thumbnail)}
                alt={title}
            />
        </a>
    {/key}
    {#if details}
        {#key id}
            <div
                class="absolute bottom-0 left-0 w-full"
                in:fly={{ x: width, duration: duration / 1.5, opacity: 1 }}
                out:fly={{ x: -width, duration, opacity: 1 }}
            >
                <div class="absolute bottom-0 rounded-tr-3xl bg-stone-950/75 px-4 py-2">
                    <a
                        href={`/level/${id}`}
                        class:featured
                        class="bottom-0 text-center text-4xl font-bold">{title}</a
                    >
                    <UserComponent prefix="by" {creator} />
                </div>
            </div>
        {/key}
    {/if}
</div>
