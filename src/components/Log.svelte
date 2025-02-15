<script lang="ts">
    import type { ValidateLog } from "../client/FileValidator";

    export let log: ValidateLog;
    // console.log(log)
    // ℹ️, ⚠️, 🛑
</script>

{#if log.level === "info"}
    <div class="log bg-blue-700/30 text-blue-500">
        <div class="flex items-center">
            <span class="icon">ℹ️</span>
            <span>{log.message}</span>
        </div>
    </div>
{:else if log.level === "warning"}
    <div class="log bg-amber-700/30 text-amber-500">
        <div class="flex items-center">
            <span class="icon">⚠️</span>
            <span>{log.message}</span>
        </div>
    </div>
{:else if log.level === "error"}
    <div class="log bg-red-700/30 text-red-500">
        <div class="flex items-center">
            <span class="icon">🛑</span>
            <span>{log.message}</span>
        </div>
    </div>
{/if}
