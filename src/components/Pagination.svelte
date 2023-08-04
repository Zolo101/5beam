<script lang="ts">
    export let page = 1;
    export let callback: (page: number) => Promise<unknown>;

    // Output variable to bind to
    export let output: unknown;

    // (Usually) server-side data, which would be replaced upon page change
    export let input: unknown = output;

    const changePage = async (by: number) => {
        // dont go below zero
        page = (page + by < 1 ? 1 : page + by);
        output = await callback(page);
        console.log(page, output)
    }
</script>

<slot></slot>
<div class="text-center text-6xl p-5 text-neutral-300 select-none">
    <span class="font-bold cursor-pointer hover:text-neutral-500 transition-colors" on:click={() => changePage(-1)}>{"⟵"}</span>
    <span class="font-bold font-mono">{page}</span>
    <span class="font-bold cursor-pointer hover:text-neutral-500 transition-colors" on:click={() => changePage(1)}>{"⟶"}</span>
</div>