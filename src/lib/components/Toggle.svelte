<script lang="ts">
    let { toggles, value = $bindable() }: { toggles: string[]; value: string } = $props();
</script>

<section class="flex rounded border-b-2 border-zinc-600">
    {#each toggles as toggle}
        <button
            class="grow cursor-pointer px-4 py-2 font-bold transition-colors hover:bg-zinc-700 {value ===
            toggle
                ? 'bg-zinc-600'
                : 'bg-zinc-800'}"
            onclick={() => (value = toggle)}
        >
            {toggle}
        </button>
    {/each}
</section>
