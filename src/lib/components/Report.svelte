<script lang="ts">
    import Flag from "$lib/assets/icons/Flag.svg?component";
    import type { SVGAttributes } from "svelte/elements";
    import ReportDialog from "./ReportDialog.svelte";

    const {
        kind,
        ...props
    }: SVGAttributes<SVGSVGElement> & {
        kind: "level" | "levelpack" | "user";
    } = $props();

    let reportSending = $state(false);
    let reportMode = $state(false);
</script>

<ReportDialog bind:open={reportMode} bind:reportSending {kind} />
<Flag
    width="48"
    height="48"
    class={[
        "cursor-pointer justify-self-end opacity-50 transition-opacity hover:opacity-100",
        reportSending && "cursor-not-allowed"
    ]}
    onclick={() => (reportMode = true)}
    {...props}
/>
