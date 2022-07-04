<script lang="ts">
    // 0 to 7
    import { difficultyMap } from "../misc";

    export let difficulty: number = 0;
    export let includeText: boolean = false;
    const name = difficultyMap.get(difficulty)
    const filename = name.toLowerCase()
</script>

<div class="star">
    {#if includeText}
        <span>{name}</span>
    {/if}
    <img src="/difficulty/{filename}.png" alt={name}>
</div>

<style>
    .star {
        display: inline;
        font-weight: bold;
    }

    img {
        width: 48px;
        height: 48px;
        padding: 5px;
        image-rendering: pixelated;
    }
</style>