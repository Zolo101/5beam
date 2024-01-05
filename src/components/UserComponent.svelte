<script lang="ts">
    import type { PocketbaseUser } from "$lib/types";

    export let user: PocketbaseUser;
    export let prefix: string;
</script>

<span>{prefix}</span>
<a href="/user/{user.id}" target="_self" class="inline font-bold p-1 transition-colors rounded hover:text-black hover:bg-neutral-300/50">
    <span>{user.username}</span>
</a>