<script lang="ts">
    import type { PageData } from "./$types";
    import type { Report } from "$lib/types";
    import Button from "$lib/components/Button.svelte";
    import { enhance } from "$app/forms";
    import { formatDate_Day } from "$lib/misc";

    let { data }: { data: PageData } = $props();
    let { reports, admin } = $derived(data);

    function disableReport(report: Report) {
        report.resolved = true;
    }
</script>

{#snippet reportComponent(report: Report)}
    {@const { kind, reason, description, reportedId, created } = report}
    <div
        class="flex w-[300px] flex-col gap-2 rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-2 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
        class:resolved={report.resolved}
    >
        <div class="flex gap-2 font-bold">
            <span class="text-amber-500">{kind.toUpperCase()}</span>
            <span>{reason.toUpperCase()}</span>
        </div>
        <Button href={`/${kind}/${reportedId}`} text="GOTO" bg="#4bdddd" newWindow />
        <p>{description}</p>
        <form method="POST" use:enhance class="flex justify-center gap-2">
            <input type="hidden" name="reportId" value={report.id} />
            <input type="hidden" name="kindId" value={reportedId} />
            <Button
                text="Resolve"
                event="resolve-report"
                bg="#4bff5d"
                onclick={() => disableReport(report)}
                formAction="?/resolve"
            />
            {#if report.kind === "level"}
                <Button
                    text="Delete"
                    event="delete-report"
                    bg="#ff5555"
                    onclick={() => disableReport(report)}
                    formAction="?/delete"
                />
            {/if}
        </form>
        <span class="text-right text-xs font-normal">{formatDate_Day(created)}</span>
    </div>
{/snippet}

{#if admin}
    <p class="mb-10 text-7xl font-bold">Reports</p>
    <div class="flex flex-wrap justify-center gap-2">
        {#each reports as report}
            {@render reportComponent(report)}
        {/each}
    </div>
{:else}
    <p>you aint admin vro 💔</p>
{/if}

<style>
    .resolved {
        opacity: 0.5;
    }
</style>
