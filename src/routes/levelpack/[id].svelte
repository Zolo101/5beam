<script lang="ts">
    import Levelpack from "../../components/levelpack/Level.svelte";
    import { getLevelpackClient } from "../../components/client/ClientSideAPI";
    import { page } from "$app/stores";

    const ID = $page.params.id
</script>

{#await getLevelpackClient(ID)}
    <p>Loading...</p>
{:then level}
    <Levelpack {level}/>
{:catch error}
    <p class="error">Error while requesting level: {error}</p>
{/await}

<style>

</style>