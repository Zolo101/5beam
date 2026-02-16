<script lang="ts">
    import { fade } from "svelte/transition";
    let { open = $bindable(false), children }: { open: boolean; children: any } = $props();
</script>

{#if open}
    <div
        class="fixed inset-0 z-10 flex items-center justify-center"
        transition:fade={{ duration: 200 }}
    >
        <div class="fixed inset-0 bg-black/75 backdrop-blur-xs"></div>
        <dialog
            class="static z-10 max-h-[90vh] max-w-[90vw] overflow-y-auto rounded-lg bg-zinc-800 shadow-lg"
            open
        >
            {@render children?.()}
        </dialog>
    </div>
{/if}
