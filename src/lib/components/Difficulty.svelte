<script lang="ts">
    // 0 to 7
    import { difficultyColorMap, difficultyImages, difficultyMap } from "$lib/misc";

    interface Props {
        difficulty: number;
        includeText?: boolean;
        includeImage?: boolean;
    }

    const { difficulty = $bindable(), includeText = false, includeImage = true }: Props = $props();
    const name = $derived(difficultyMap.get(difficulty) ?? "unknown");
    const filename = $derived(name.toLowerCase());
    const image = $derived(difficultyImages[`/src/lib/assets/difficulty/${filename}.png`].default);
</script>

<section class="flex items-center gap-1">
    {#if includeText}
        <span style:color={difficultyColorMap.get(difficulty)}>{name}</span>
    {/if}
    {#if includeImage}
        <img class="inline" src={image} alt={name} />
    {/if}
</section>

<style>
    img {
        width: 35px;
        height: 35px;
        image-rendering: pixelated;
    }
</style>
