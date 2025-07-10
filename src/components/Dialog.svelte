<script lang="ts">
    import { fade } from "svelte/transition";
    let { open = $bindable(false), children }: { open: boolean; children: any } = $props();
</script>

{#if open}
    <div
        class="fixed inset-0 z-10 flex items-center justify-center"
        transition:fade={{ duration: 200 }}
    >
        <!-- Background -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-xs"></div>
        <!-- Dialog -->
        <dialog id="myDialog" class="relative static z-10 rounded-lg bg-zinc-800 shadow-lg" open>
            {@render children?.()}
        </dialog>
    </div>
{/if}
