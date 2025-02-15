<script lang="ts">
    import type { PocketbaseUser } from "$lib/types";

    export let user: PocketbaseUser;
    export let prefix: string;
</script>

<span class="font-normal">{prefix}</span><a
    href="/user/{user.id}"
    target="_self"
    class="rounded-sm p-1 font-bold transition-colors hover:bg-neutral-300/50 hover:text-black"
    >{user.username}</a
>
