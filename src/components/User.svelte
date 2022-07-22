<script lang="ts">
    export let user;
    export let prefix;
</script>

<span>{prefix}</span>
<a href="/user/{user.id}" target="_self">
    <span>{user.name}</span>
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