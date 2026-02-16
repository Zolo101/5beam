<script lang="ts">
    import { enhance } from "$app/forms";
    import { page } from "$app/state";

    interface Props {
        action: string;
        data?: Record<string, string>;
        text?: string;
        bg?: string;
        event?: string;
        disabled?: boolean;
    }

    let {
        action,
        data,
        text = "(text)",
        bg = "#ffffff",
        event = "",
        disabled = false
    }: Props = $props();
</script>

{#if page.data.admin}
    <form use:enhance method="POST" action="/admin?/{action}">
        {#if data}
            {#each Object.entries(data) as [key, value]}
                <input type="hidden" name={key} {value} />
            {/each}
        {/if}
        <button
            type="submit"
            {disabled}
            data-umami-event={event}
            class="
    button h-10 w-full cursor-pointer text-black inset-shadow-xs inset-shadow-black/50 transition-all hover:outline-black/50 hover:brightness-75
        disabled:cursor-not-allowed disabled:opacity-75 disabled:brightness-75
    "
            style="background-color: {bg}"
        >
            {text}
        </button>
    </form>
{/if}
