<script lang="ts">
    import type { ValidateLog } from "../client/FileValidator";

    export let log: ValidateLog;
    // console.log(log)
    // ℹ️, ⚠️, 🛑
</script>

{#if log.level === "info"}
    <div class="bg-blue-700 text-blue-500 log">
        <div class="flex items-center">
            <span class="icon">ℹ️</span>
            <span>{log.message}</span>
        </div>
    </div>
{:else if log.level === "warning"}
    <div class="bg-amber-700 text-amber-500 log">
        <div class="flex items-center">
            <span class="icon">⚠️</span>
            <span>{log.message}</span>
        </div>
    </div>
{:else if log.level === "error"}
    <div class="bg-red-700 text-red-500 log">
        <div class="flex items-center">
            <span class="icon">🛑</span>
            <span>{log.message}</span>
        </div>
    </div>
{/if}

<style>
    .log {
        @apply bg-opacity-30 rounded font-bold p-2 my-2 shadow drop-shadow;
    }

    .icon {
        @apply text-2xl;
    }
</style>