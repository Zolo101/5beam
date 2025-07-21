<script lang="ts">
    import star from "$lib/assets/star.png";

    interface Props {
        amount?: number;
        includeText?: boolean;
    }

    let { amount = 0, includeText = true }: Props = $props();
</script>

<div class="star">
    {#if includeText}
        <span>{amount}</span>
    {/if}
    <img src={star} alt="Star" />
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
