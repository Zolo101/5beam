<script lang="ts">
    import Table from "$lib/components/layout/Table.svelte";
    import Filepath from "./Filepath.svelte";

    interface Props {
        endpoint: string[];
        deprecated?: boolean;
        wip?: boolean;
        // protected endpoints
        game_only?: boolean;
        token_required?: boolean;
        type?: "INFO" | "GET" | "POST" | "STRUCT" | "WARNING";
        params?: [string, string, string, unknown?][];
        code?: string;
        open?: boolean;
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
        open,
        children
    }: Props = $props();

    const colors = {
        INFO: "grey",
        GET: "lawngreen",
        POST: "hotpink",
        STRUCT: "deepskyblue",
        WARNING: "orange"
    };
</script>

<details
    class="rounded-xl bg-zinc-800/80 outline outline-white/10 backdrop-blur-xl"
    class:deprecated={deprecated || wip}
    class:game_only
    {open}
>
    <summary
        class="flex cursor-pointer items-baseline justify-between rounded-xl bg-zinc-900 px-5 py-2 text-2xl font-bold select-none"
        style="background-color: color-mix(in oklab, {colors[type]} 20%, #18181b)"
    >
        <div>
            <span style="color: {colors[type]}">{type}</span>
            <span class="name"><Filepath directory={endpoint} /></span>
        </div>
        {#if token_required}
            <span class="text-2xl text-yellow-300">Auth Required</span>
        {/if}
    </summary>
    <div class="p-5 text-sm">
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
                class="overflow-auto rounded-sm bg-zinc-800 p-5 font-mono text-xs text-wrap wrap-anywhere outline outline-zinc-500">{code}</pre>
        {/if}

        {#if children}
            <div class="p-5 text-neutral-300">
                {@render children?.()}
            </div>
        {/if}
    </div>
</details>
