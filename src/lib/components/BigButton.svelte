<script lang="ts">
    interface Props {
        text?: string;
        bg?: string;
        href?: string;
        onclick?: () => void;
        event?: string;
        disabled?: boolean;
        newWindow?: boolean;
    }

    let {
        text = "(text)",
        bg = "#ffffff",
        href,
        onclick,
        event = "",
        disabled = false,
        newWindow = false
    }: Props = $props();

    const buttonClass =
        "button inline-flex h-24 w-full items-center justify-center cursor-pointer text-black/75 inset-ring-2 inset-shadow-sm inset-shadow-black/25 inset-ring-white/10 transition-all hover:outline-black/50 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-75 disabled:brightness-75";
</script>

{#if href && !disabled}
    <a
        {href}
        {onclick}
        target={newWindow ? "_blank" : "_self"}
        rel={newWindow ? "noopener noreferrer" : undefined}
        class={buttonClass}
        style="background-color: {bg}"
    >
        <!-- Track the label so analytics does not intercept link navigation. -->
        <span class="flex h-full w-full items-center justify-center" data-umami-event={event}>
            {text}
        </span>
    </a>
{:else}
    <button
        type="button"
        {disabled}
        {onclick}
        data-umami-event={event}
        class={buttonClass}
        style="background-color: {bg}"
    >
        {text}
    </button>
{/if}
