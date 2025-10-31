<script lang="ts">
    import type { PocketbaseUser } from "$lib/types";
    const { creator = $bindable(), prefix }: { creator: PocketbaseUser | null; prefix: string } =
        $props();
    const { id, username } = $derived(creator ?? { id: "0", username: "Guest" });
</script>

{#if creator}
    <span class="font-normal">{prefix}</span>
    <!-- <img
        src={creator.avatar || questionIcon}
        alt="Profile"
        class="inline max-w-4 min-w-4 rounded-full"
    /> -->
    <a
        href="/user/{id}"
        target="_self"
        class="rounded-sm py-1 font-bold transition-colors hover:bg-red-300/50 hover:text-black"
        ><span>scary</span> {username}</a
    >
{:else}
    <span class="font-normal">{prefix}</span>
    <span class="font-bold">Guest</span>
{/if}
