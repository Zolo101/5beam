<script lang="ts">
    // 0 to 7
    import { difficultyColorMap, difficultyMap } from "$lib/misc";
    import type { Picture } from "@sveltejs/enhanced-img";

    // Keep the original pixel grid instead of generating a half-resolution variant.
    const difficultyImages = import.meta.glob<Picture>("$lib/assets/difficulty/*.png", {
        eager: true,
        import: "default",
        query: "?w=16&format=png&lossless&enhanced"
    });

    interface Props {
        difficulty: number;
        includeText?: boolean;
        includeImage?: boolean;
    }

    const { difficulty = $bindable(), includeText = false, includeImage = true }: Props = $props();
    const name = $derived(difficultyMap.get(difficulty) ?? "unknown");
    const filename = $derived(name.toLowerCase());
    const image = $derived(difficultyImages[`/src/lib/assets/difficulty/${filename}.png`]);
</script>

<section class="flex items-center gap-1">
    {#if includeText}
        <span style:color={difficultyColorMap.get(difficulty)}>{name}</span>
    {/if}
    {#if includeImage}
        <enhanced:img class="inline" src={image} alt={name} sizes="35px" />
    {/if}
</section>

<style>
    enhanced\:img {
        width: 35px;
        height: 35px;
        image-rendering: pixelated;
    }
</style>
