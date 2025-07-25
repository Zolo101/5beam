<script lang="ts">
    import { enhance } from "$app/forms";
    import Button from "./Button.svelte";
    import Dialog from "./Dialog.svelte";
    import FiveBStyle from "./FiveBStyle.svelte";

    let {
        open = $bindable(),
        reportSending = $bindable(),
        kind
    }: {
        open: boolean;
        reportSending: boolean;
        kind: "level" | "levelpack" | "user";
    } = $props();
    let selectedReason = $state("inappropriate");
</script>

<Dialog bind:open>
    <div class="relative flex gap-5 overflow-hidden rounded-lg p-5 text-xl">
        <div class="flex flex-col gap-3">
            <div class="p-10 text-center text-5xl">
                <FiveBStyle text="Report {kind}" />
            </div>
            <form class="flex flex-col gap-3" use:enhance method="POST" action="?/report">
                <input type="hidden" name="reportKind" value={kind} />
                <label for="reportReason" class="text-2xl font-bold">Reason</label>
                <select
                    name="reportReason"
                    class="mb-1 rounded-lg bg-black/30 p-2.5"
                    bind:value={selectedReason}
                >
                    <option value="inappropriate">Inappropriate</option>
                    <option value="spam">Spam</option>
                    <option value="other">Other (please specify)</option>
                </select>
                {#if selectedReason === "other"}
                    <textarea
                        name="reportDesc"
                        class="rounded-lg bg-black/30 p-2.5"
                        rows="5"
                        cols="33"
                        maxlength="1024"
                    ></textarea>
                {/if}
                <Button
                    text="Send"
                    event="send-report"
                    bg="#ff5555"
                    onclick={() => {
                        open = false;
                        reportSending = true;
                    }}
                    type="submit"
                />
            </form>
        </div>
    </div>
</Dialog>
