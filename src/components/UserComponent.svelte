<script lang="ts">
    import type { PocketbaseUser } from "$lib/types";
    const { creator = $bindable(), prefix }: { creator: PocketbaseUser | null; prefix: string } =
        $props();
    const { id, username } = $derived(creator ?? { id: "0", username: "Guest" });
</script>

<!-- TODO: Add avatar -->
{#if creator}
    <span class="font-normal">{prefix}</span><a
        href="/user/{id}"
        target="_self"
        class="rounded-sm p-1 font-bold transition-colors hover:bg-neutral-300/50 hover:text-black"
        >{username}</a
    >
{:else}
    <span class="font-normal">{prefix}</span>
    <span class="font-bold">Guest</span>
{/if}
