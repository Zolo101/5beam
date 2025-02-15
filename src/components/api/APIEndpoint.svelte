<script lang="ts">
    import Table from "../layout/Table.svelte";
    import Filepath from "./Filepath.svelte";

    export let endpoint: string[];
    export let deprecated = false;
    export let wip = false;
    export let game_only = false;
    export let token_required = false;
    export let type: "INFO" | "GET" | "POST" | "STRUCT" = "GET";
    export let params: [[unknown, unknown, unknown, unknown?]];
    export let code: string;

    let colors = new Map<string, string>([
        ["INFO", "grey"],
        ["GET", "lawngreen"],
        ["POST", "hotpink"],
        ["STRUCT", "deepskyblue"]
    ]);
</script>

<section
    class="w-[min(60vw, 1000px)] m-5 rounded-sm bg-neutral-600/40 shadow-2xl outline outline-white/10 backdrop-blur-xl"
    class:deprecated={deprecated || wip}
    class:game_only
>
    <div class="inline bg-black p-2 text-3xl font-bold">
        <span style:color={colors.get(type)}>{type}</span>
        <span class="name"><Filepath directory={endpoint} /></span>
        {#if token_required}
            <span class="float-right bg-black p-2 text-lg text-amber-600">user token required</span>
        {/if}
    </div>
    <div class="p-5">
        {#if deprecated}
            <p class="warning">Warning, this endpoint is deprecated! Do not use!</p>
        {/if}

        {#if wip}
            <p class="warning">Warning, this endpoint is in progress! Do not use!</p>
        {/if}

        {#if game_only}
            <p class="warning endpoint-game_only">
                For now, this endpoint can only be used on HTML5b's site.
            </p>
        {/if}

        {#if params}
            <Table
                title="Parameters"
                heads={["Name", "Description", "Type", "Defaults"]}
                content={params}
                dynamicWidth={true}
            />
        {/if}

        {#if code}
            <pre
                class="rounded-sm bg-neutral-800 p-5 font-mono outline outline-neutral-500">{code}</pre>
        {/if}

        <div class="p-5 text-neutral-300">
            <slot></slot>
        </div>
    </div>
</section>