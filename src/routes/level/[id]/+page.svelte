<script lang="ts">
    import Level from "../../../components/levelpack/Level.svelte";
    import { getLevelClient } from "../../../client/ClientSideAPI";
    import { page } from "$app/stores";

    const ID = $page.params.id
</script>

{#await getLevelClient(ID)}
    <p>Loading...</p>
{:then level}
    <Level {level}/>
{:catch error}
    <p class="error">Error while requesting level: {error}</p>
{/await}

<style>

</style>