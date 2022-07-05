<script lang="ts">
    import Levelpack from "../../components/levelpack/Levelpack.svelte";
    import { getLevelClient } from "../../components/ClientSideAPI";
    import { page } from "$app/stores";

    const ID = $page.params.id
</script>

{#await getLevelClient(ID)}
    <p>Loading...</p>
{:then level}
    <Levelpack {level}/>
{:catch error}
    <p class="error">Error while requesting level: {error}</p>
{/await}

<style>

</style>