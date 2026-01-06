<script lang="ts">
    import StarEnabled from "$lib/assets/icons/starEnabled.svg?component";
    import type { SVGAttributes } from "svelte/elements";

    const {
        starred = $bindable(true),
        ...props
    }: SVGAttributes<SVGSVGElement> & { starred?: boolean } = $props();
</script>

<StarEnabled {...props} opacity={starred ? 1 : 0.5} />
