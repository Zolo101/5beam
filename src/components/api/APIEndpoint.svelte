<script lang="ts">
    import Table from "../layout/Table.svelte";
    import Filepath from "./Filepath.svelte";

    export let endpoint: string[]
    export let deprecated = false
    export let wip = false
    export let game_only = false
    export let token_required = false
    export let type: "GET" | "POST" | "STRUCT" = "GET"
    export let params: [[string, string, string, string?]]
    export let example: string
</script>

<div class="endpoint"
     class:deprecated={deprecated | wip}
     class:game_only={game_only}
>
    <div class="title">
        <span class="type-{type}">{type}</span>
        <span class="name"><Filepath directory={endpoint}/></span>
        {#if token_required}
            <span class="token-required">user token required</span>
        {/if}
    </div>
    <div class="header">
        {#if deprecated}
            <p class="warning">Warning, this endpoint is deprecated! Do not use!</p>
        {/if}

        {#if wip}
            <p class="warning">Warning, this endpoint is in progress! Do not use!</p>
        {/if}

        {#if game_only}
            <p class="warning endpoint-game_only">This endpoint can only be used on HTML5b's site.</p>
        {/if}

        {#if params}
            <Table title="Parameters" heads={["Name", "Description", "Type", "Defaults"]} content={params} dynamicWidth={true}/>
        {/if}

        {#if example}
            <p class="endpoint-example">{example}</p>
        {/if}

        <div class="description">
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .endpoint {
        background: grey;
        width: min(60vw, 1000px);
        margin: 20px;
        box-shadow: 0 0 5px 2px black;
        border-radius: 2px;
    }

    .title {
        display: inline;
        background-color: black;
        color: whitesmoke;
        font-size: 2rem;
        font-weight: bold;
        padding: 10px;
    }

    .type-GET {
        color: lawngreen;
    }

    .type-POST {
        color: hotpink;
    }

    .type-STRUCT {
        color: deepskyblue;
    }

    .header {
        padding: 20px;
    }

    .warning {
        display: inline-block;
        background-color: black;
        color: whitesmoke;
        font-size: 1.25em;
        font-weight: bold;
        padding: 10px;
        margin: 0 0 30px 0;
    }

    .token-required {
        font-size: 0.5em;
        float: right;
        color: orangered;
        background-color: black;
        padding: 5px;
    }

    .endpoint.deprecated {
        background: repeating-linear-gradient(45deg, grey, grey 40px, #7f7b78 40px, #7f7b78 80px);
    }

    .endpoint.game_only {
        background: #847877
    }

    .endpoint.deprecated .name, .warning {
        color: orange;
    }

    .endpoint.game_only .name, .endpoint-game_only {
        color: palevioletred;
    }

    .description {
        color: whitesmoke;
    }
</style>