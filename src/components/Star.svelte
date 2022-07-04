<script lang="ts">
    export let amount: number = 0;
    export let includeText: boolean = true;
</script>

<div class="star">
    {#if includeText}
        <span>{amount}</span>
    {/if}
    <img src="/star.png" alt="Star">
</div>

<style>
    .star {
        display: inline-flex;
        align-items: center;
        font-weight: bold;
    }

    img {
        width: 32px;
        height: 32px;
        /*padding: 5px;*/
        image-rendering: pixelated;
    }
</style>