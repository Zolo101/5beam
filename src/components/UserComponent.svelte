<script lang="ts">
    import type { PocketbaseUser } from "$lib/types";

    export let user: PocketbaseUser;
    export let prefix: string;
</script>

<span class="font-normal">{prefix}</span><a href="/user/{user.id}" target="_self" class="font-bold p-1 transition-colors rounded hover:text-black hover:bg-neutral-300/50">{user.username}</a>