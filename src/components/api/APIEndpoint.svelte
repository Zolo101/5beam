<script lang="ts">
    import Table from "../layout/Table.svelte";
    import Filepath from "./Filepath.svelte";

    export let endpoint: string[]
    export let deprecated = false
    export let wip = false
    export let game_only = false
    export let token_required = false
    export let type: "INFO" | "GET" | "POST" | "STRUCT" = "GET"
    export let params: [[unknown, unknown, unknown, unknown?]];
    export let code: string

    let colors = new Map<string, string>([
        ["INFO", "grey"],
        ["GET", "lawngreen"],
        ["POST", "hotpink"],
        ["STRUCT", "deepskyblue"]
    ])
</script>

<div class="bg-neutral-600 w-[min(60vw, 1000px)] m-5 outline outline-black shadow-xl rounded"
     class:deprecated={deprecated | wip}
     class:game_only={game_only}
>
    <div class="inline bg-black text-3xl font-bold p-2">
        <span style:color={colors.get(type)}>{type}</span>
        <span class="name"><Filepath directory={endpoint}/></span>
        {#if token_required}
            <span class="text-lg bg-black float-right text-amber-600 p-2">user token required</span>
        {/if}
    </div>
    <div class="p-5">
        {#if deprecated}
            <p class="warning">Warning, this endpoint is deprecated! Do not use!</p>
        {/if}

        {#if wip}
            <p class="warning">Warning, this endpoint is in progress! Do not use!</p>
        {/if}

        <!--{#if game_only}-->
        <!--    <p class="warning endpoint-game_only">This endpoint can only be used on HTML5b's site.</p>-->
        <!--{/if}-->

        {#if params}
            <Table title="Parameters" heads={["Name", "Description", "Type", "Defaults"]} content={params} dynamicWidth={true}/>
        {/if}

        {#if code}
            <pre class="bg-neutral-800 font-mono outline outline-neutral-500 rounded p-5">{code}</pre>
        {/if}

        <div class="text-neutral-300 p-5">
            <slot></slot>
        </div>
    </div>
</div>

<style>
    .warning {
        @apply inline-block bg-black text-xl font-bold p-2 mb-7;
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
</style>