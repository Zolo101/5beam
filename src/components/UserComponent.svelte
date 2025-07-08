<script lang="ts">
    import type { PocketbaseUser } from "$lib/types";
    const { creator = $bindable(), prefix }: { creator: PocketbaseUser; prefix: string } = $props();
    let { id, username } = $derived(creator);
</script>

<span class="font-normal">{prefix}</span><a
    href="/user/{id}"
    target="_self"
    class="rounded-sm p-1 font-bold transition-colors hover:bg-neutral-300/50 hover:text-black"
    >{username}</a
>
