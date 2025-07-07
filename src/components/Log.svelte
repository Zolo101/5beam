<script lang="ts">
    import type { ValidateLog } from "../client/FileValidator";

    interface Props {
        log: ValidateLog; // console.log(log)
    }

    let { log }: Props = $props();
    
    // ℹ️, ⚠️, 🛑
</script>

{#if log.level === "info"}
    <div class="log bg-blue-900/75 text-blue-200">
        <div class="flex items-center">
            <span class="icon">ℹ️</span>
            <span>{log.message}</span>
        </div>
    </div>
{:else if log.level === "warning"}
    <div class="log bg-amber-900/75 text-amber-200">
        <div class="flex items-center">
            <span class="icon">⚠️</span>
            <span>{log.message}</span>
        </div>
    </div>
{:else if log.level === "error"}
    <div class="log bg-red-900/75 text-red-200">
        <div class="flex items-center">
            <span class="icon">🛑</span>
            <span>{log.message}</span>
        </div>
    </div>
{/if}
