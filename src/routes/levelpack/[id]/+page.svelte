<script lang="ts">
    import Levelpack from "../../../components/levelpack/Levelpack.svelte";
    import { getLevelpackClient } from "../../../components/client/ClientSideAPI";
    import { page } from "$app/stores";

    const ID = $page.params.id
</script>

{#await getLevelpackClient(ID)}
    <p>Loading...</p>
{:then levelpack}
    <Levelpack {levelpack}/>
{:catch error}
    <p class="error">Error while requesting levelpack: {error}</p>
{/await}

<style>

</style>