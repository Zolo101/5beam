<script lang="ts">
    import type { PocketbaseUser } from "$lib/types";
    let { creator, prefix }: { creator: PocketbaseUser; prefix: string } = $props();
    const { id, username } = creator;
</script>

<span class="font-normal">{prefix}</span><a
    href="/user/{id}"
    target="_self"
    class="rounded-sm p-1 font-bold transition-colors hover:bg-neutral-300/50 hover:text-black"
    >{username}</a
>
