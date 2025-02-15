<script lang="ts">
    import type { DetectedLevel } from "../client/FileValidator";
    import { backgrounds, to5bLevelFormat } from "../misc";

    export let level: DetectedLevel;
    $: opened = false;

    // TODO: Find a better way to get the log level of a validation
    const warningLog = level.logs.find((l) => l.level === "warning") !== undefined;
    const errorLog = level.logs.find((l) => l.level === "error") !== undefined;

    const getBackground = (background: number) =>
        backgrounds[`/src/lib/assets/backgrounds/${background}.png`];
</script>

<!--    TODO: Is the "button" role appropriate for this? -->
<div
    role="button"
    class="
    h-[128px] w-[128px] transform cursor-pointer rounded-[10px] bg-cover shadow-xl
    duration-200 ease-in-out select-none hover:scale-105 hover:shadow-2xl hover:outline hover:outline-4 hover:outline-white/10
"
    class:warningLog
    class:errorLog
    style="background-image: url({getBackground(level.background)});"
    on:click={() => (opened = !opened)}
>
    <span class="z-0 px-1.5 text-4xl font-bold text-white mix-blend-overlay select-none"
        >{to5bLevelFormat(level.id)}</span
    >
</div>

<style>
    .warningLog {
        @apply shadow-amber-900 outline outline-4 outline-amber-500;
    }

    .errorLog {
        @apply shadow-red-900 outline outline-4 outline-red-500;
    }
</style>
