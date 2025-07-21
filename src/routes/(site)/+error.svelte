<script lang="ts">
    import { page } from "$app/state";
    import FiveBStyle from "$lib/components/FiveBStyle.svelte";
</script>

<div class="flex h-full w-full flex-col items-center justify-center text-white *:m-0 *:text-center">
    <p class="text-[15em]">
        <FiveBStyle text={page.status.toString()} />
    </p>
    <p class="text-6xl">{page.error?.message || "Page not found"}</p>
</div>
