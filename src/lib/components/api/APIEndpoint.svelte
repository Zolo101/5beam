<script lang="ts">
    import Table from "$lib/components/layout/Table.svelte";
    import Filepath from "./Filepath.svelte";

    interface Props {
        endpoint: string[];
        deprecated?: boolean;
        wip?: boolean;
        game_only?: boolean;
        token_required?: boolean;
        type?: "INFO" | "GET" | "POST" | "STRUCT";
        params?: [string, string, string, unknown?][];
        code?: string;
        children?: import("svelte").Snippet;
    }

    let {
        endpoint,
        deprecated = false,
        wip = false,
        game_only = false,
        token_required = false,
        type = "GET",
        params,
        code,
        children
    }: Props = $props();

    const colors = {
        INFO: "grey",
        GET: "lawngreen",
        POST: "hotpink",
        STRUCT: "deepskyblue"
    };
</script>

<section
    class="bg-neutral-600/40 outline outline-white/10 backdrop-blur-xl"
    class:deprecated={deprecated || wip}
    class:game_only
>
    <div class="bg-black p-2 text-3xl font-bold">
        <span style:color={colors[type]}>{type}</span>
        <span class="name"><Filepath directory={endpoint} /></span>
        {#if token_required}
            <span class="float-right bg-black p-2 text-lg text-amber-600">Auth Required</span>
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
            <p class="warning endpoint-game_only text-sm">
                For now, this endpoint can only be used on HTML5b's site. Let me know if you would
                like access to this.
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
            {@render children?.()}
        </div>
    </div>
</section>
