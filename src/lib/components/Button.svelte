<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";

    interface Props extends Omit<HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>, "onclick"> {
        text?: string;
        bg?: string;
        href?: string;
        event?: string;
        disabled?: boolean;
        newWindow?: boolean;
        onclick?: () => void;
        type?: "button" | "submit" | "reset";
    }

    let {
        text = "(text)",
        bg = "#ffffff",
        href,
        event = "",
        disabled = false,
        newWindow = false,
        onclick,
        ...rest
    }: Props = $props();

    const buttonClass =
        "button inline-flex h-10 w-full items-center justify-center cursor-pointer text-black inset-shadow-xs inset-shadow-black/50 transition-all hover:outline-black/50 hover:brightness-75 disabled:cursor-not-allowed disabled:opacity-75 disabled:brightness-75";
</script>

{#if href && !disabled}
    <a
        {href}
        {onclick}
        target={newWindow ? "_blank" : "_self"}
        rel={newWindow ? "noopener noreferrer" : undefined}
        {...rest}
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
        type={onclick ? "button" : "submit"}
        {disabled}
        {onclick}
        data-umami-event={event}
        {...rest}
        class={buttonClass}
        style="background-color: {bg}"
    >
        {text}
    </button>
{/if}
