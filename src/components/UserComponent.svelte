<script lang="ts">
    import type { User } from "$lib/types";

    export let user: User;
    export let prefix: string;
</script>

<span>{prefix}</span>
<a href="/user/{user.id}" target="_self">
    <span>{user.username}</span>
</a>

<style>
    a {
        display: inline;
        font-weight: bold;
        padding: 4px;
        transition: background-color 0.3s;
    }

    a:hover {
        background-color: rgba(245, 245, 245, 0.5);
        color: black;
    }
</style>