<script lang="ts">
    import type { ValidateLog } from "$lib/client/FileValidator";

    interface Props {
        log: ValidateLog;
    }

    let { log }: Props = $props();

    const text = {
        info: "ℹ️",
        warning: "⚠️",
        error: "🛑"
    };
</script>

<div
    class={[
        log.level === "info" && "bg-blue-900 text-blue-200",
        log.level === "warning" && "bg-amber-900 text-amber-200",
        log.level === "error" && "bg-red-900 text-red-200",
        "my-2 rounded p-2 font-bold"
    ]}
>
    <div class="flex items-center gap-3">
        <span class="text-2xl">{text[log.level]}</span>
        <span>{log.message}</span>
    </div>
</div>
