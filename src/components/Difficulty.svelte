<script lang="ts">
    // 0 to 7
    import { difficultyColorMap, difficultyImages, difficultyMap } from "../misc";

    interface Props {
        difficulty?: number;
        includeText?: boolean;
        includeImage?: boolean;
    }

    let { difficulty = 0, includeText = false, includeImage = true }: Props = $props();
    const name = difficultyMap.get(difficulty) ?? "unknown";
    const filename = name.toLowerCase();
    const image = difficultyImages[`/src/lib/assets/difficulty/${filename}.png`].default;
</script>

<section>
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
