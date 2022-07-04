<script lang="ts">
    import Table from "../Table.svelte";
    import Filepath from "./Filepath.svelte";

    export let endpoint: string[] = undefined
    export let deprecated: boolean = false
    export let wip: boolean = false
    export let game_only: boolean = false
    export let type: "GET" | "POST" | "STRUCT" = "GET"
    export let params: [[string, string, string, string?]] = undefined
    export let example: string = undefined
</script>

<div class="endpoint"
     class:deprecated={deprecated | wip}
     class:game_only={game_only}
>
    <div class="endpoint-title">
        <span class="endpoint-type-{type}">{type}</span>
        <span class="endpoint-name"><Filepath directory={endpoint}/></span>
    </div>
    <div class="endpoint-desc-container">
        {#if deprecated}
            <p class="endpoint-warning">Warning, this endpoint is deprecated! Do not use!</p>
        {/if}

        {#if wip}
            <p class="endpoint-warning">Warning, this endpoint is in progress! Do not use!</p>
        {/if}

        {#if game_only}
            <p class="endpoint-warning endpoint-game_only">This endpoint can only be used on HTML5b's site.</p>
        {/if}

        {#if params}
            <Table title="Parameters" heads={["Name", "Description", "Type", "Defaults"]} content={params} dynamicWidth={true}/>
        {/if}

        {#if example}
            <p class="endpoint-example">{example}</p>
        {/if}

        <div class="endpoint-description">
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .endpoint {
        background: grey;
        width: min(60vw, 1000px);
        margin: 20px;
        box-shadow: 0px 0px 5px 2px black;
        border-radius: 2px;
    }

    .endpoint-title {
        display: inline;
        background-color: black;
        color: whitesmoke;
        font-size: 2rem;
        font-weight: bold;
        padding: 10px;
    }

    .endpoint-type-GET {
        color: lawngreen;
    }

    .endpoint-type-POST {
        color: hotpink;
    }

    .endpoint-type-STRUCT {
        color: deepskyblue;
    }

    .endpoint-desc-container {
        padding: 20px;
    }

    .endpoint-warning {
        display: inline-block;
        background-color: black;
        color: whitesmoke;
        font-size: 1.25em;
        font-weight: bold;
        padding: 10px;
        margin: 0 0 30px 0;
    }

    .endpoint.deprecated {
        background: repeating-linear-gradient(45deg, grey, grey 40px, #7f7b78 40px, #7f7b78 80px);
    }

    .endpoint.game_only {
        background: #847877
    }

    .endpoint.deprecated .endpoint-name, .endpoint-warning {
        color: orange;
    }

    .endpoint.game_only .endpoint-name, .endpoint-game_only {
        color: palevioletred;
    }

    .endpoint-description {
        color: whitesmoke;
    }
</style>