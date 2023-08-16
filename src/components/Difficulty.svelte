<script lang="ts">
    // 0 to 7
    import { difficultyImages, difficultyMap } from "../misc";

    export let difficulty: number = 0;
    export let includeText: boolean = false;
    const name = difficultyMap.get(difficulty) ?? "unknown"
    const filename = name.toLowerCase()
    const image = difficultyImages[`/src/lib/assets/difficulty/${filename}.png`]
</script>

<div>
    {#if includeText}
        <span>{name}</span>
    {/if}
    <img class="inline" src={image} alt={name}>
</div>

<!-- TODO: Increase difficulty icon setting? -->
<style>
    img {
        width: 35px;
        height: 35px;
        /*padding: 5px;*/
        image-rendering: pixelated;
    }
</style>