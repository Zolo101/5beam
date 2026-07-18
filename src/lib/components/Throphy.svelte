<script lang="ts">
    import FiveBysNominated from "$lib/assets/badges/5bys_2026_nominated.webp";
    import FiveBysWinner from "$lib/assets/badges/5bys_2026_winner.webp";
    import Featured from "$lib/assets/icons/Featured.svg?url";

    const { badge }: { badge: string } = $props();
    const image = $derived(() => {
        switch (badge) {
            case "9ypuh5kv1p5sjp1":
                return FiveBysNominated;
            case "68qn1nrjzyifz3h":
                return FiveBysWinner;
            case "qajlslyb3vewq20":
                return Featured;
            default:
                return null;
        }
    });
</script>

<!-- TODO: title prop for name of throphy -->
{#if image !== null}
    <img src={image()} alt={badge} class="my-auto h-16 w-16 object-contain" />
{:else}
    <p class="text-4xl text-red-500">no throphy found!</p>
{/if}
