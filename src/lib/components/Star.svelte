<script lang="ts">
    import StarEnabled from "$lib/assets/icons/starEnabled.svg?component";
    import { operateStar } from "$lib/stars.remote";
    import type { SVGAttributes } from "svelte/elements";

    let {
        stars = $bindable(),
        starred = $bindable(false),
        id,
        type,
        ...props
    }: SVGAttributes<SVGSVGElement> & {
        stars: number;
        id: string;
        type: string;
        starred?: boolean;
    } = $props();

    async function handleStarClick() {
        try {
            const result = await operateStar({ id, type });
            starred = result.starred;

            // @ts-ignore
            if (starred) window.umami?.track("star");

            starred ? stars++ : stars--;
        } catch (err) {
            console.error("Failed to star/unstar level:", err);
        }
    }
</script>

<StarEnabled
    {...props}
    class="hover:opactiy-100 cursor-pointer opacity-50 transition-all hover:scale-105 {starred &&
        'opacity-100'}"
    opacity={starred ? 1 : 0.5}
    onclick={handleStarClick}
/>
