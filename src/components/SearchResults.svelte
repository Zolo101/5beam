<script lang="ts">
    import Difficulty from "./Difficulty.svelte";
    import { formatDate_Day } from "../misc";
    import User from "./UserComponent.svelte";
    import type { Level } from "$lib/types";

    export let search: string;
    export let results: Level[];
    // console.log(results)
</script>

<div class="results">
    {#each results as result}
        <!-- TODO: This doesnt need a full reload when already in /levels/ just refresh the component -->
        <a href="/level/{result.id}" target="_self">
            <div class="result">
                {#if result.title === search || results.length === 1}
                    <div class="header">
                        <span class="title exact">{result.title}</span>
                        <div>
                            <p class="plays">{result.plays} plays</p>
                            <p class="stars">{result.stars} stars</p>
                        </div>
                        <Difficulty difficulty={result.difficulty} />
                    </div>
                    <br />
                {:else}
                    <p class="title">{result.title}</p>
                {/if}
                <div class="footer">
                    <User prefix="By" user={result.creator} />
                    <p>@ {formatDate_Day(result.createdAt)}</p>
                </div>
            </div>
        </a>
    {/each}
</div>

<style>
    .results {
        display: flex;
        flex-direction: column;
        position: absolute;
        width: 292px;
        z-index: 1;
    }

    .result {
        background-color: grey;
        padding: 5px;
        border-bottom: 1px solid dimgrey;
    }

    .result:hover {
        background-color: #999999;
        cursor: pointer;
    }

    .title {
        font-size: 1.5em;
        font-weight: bold;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    p,
    span {
        margin: 0;
    }

    .exact {
        font-size: 1.8em;
    }

    .plays {
        color: whitesmoke;
    }
    .stars {
        color: gold;
    }
</style>
