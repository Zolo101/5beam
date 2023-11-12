<script lang="ts">
        import type { DetectedLevel } from "../client/FileValidator";
        import { backgrounds, to5bLevelFormat } from "../misc";

        export let level: DetectedLevel
    $: opened = false

    // TODO: Find a better way to get the log level of a validation
    const warningLog = level.logs.find((l) => l.level === "warning") !== undefined
    const errorLog = level.logs.find((l) => l.level === "error") !== undefined

    const getBackground = (background: number) => backgrounds[`/src/lib/assets/backgrounds/${background}.png`]
</script>

<!--    TODO: Is the "button" role appropriate for this? -->
<div role="button" class="
    w-[128px] h-[128px] rounded-[10px] shadow-xl cursor-pointer bg-cover select-none
    duration-200 ease-in-out transform hover:scale-105 hover:shadow-2xl hover:outline hover:outline-4 hover:outline-white/10
" class:warningLog class:errorLog style="background-image: url({getBackground(level.background)});" on:click={() => opened = !opened}>
        <span class="px-1.5 text-white text-4xl font-bold z-0 mix-blend-overlay select-none">{to5bLevelFormat(level.id)}</span>
</div>

<style>
    .warningLog {
        @apply outline outline-4 outline-amber-500 shadow-amber-900;
    }

    .errorLog {
        @apply outline outline-4 outline-red-500 shadow-red-900;
    }
</style>