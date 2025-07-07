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
        href = "#",
        onclick = () => {},
        event = "",
        disabled = false,
        newWindow = false
    }: Props = $props();
</script>

<a {href} {onclick} target={newWindow ? "_blank" : "_self"}>
    <button
        {disabled}
        data-umami-event={event}
        class="
        button h-24 w-full cursor-pointer text-black/75 inset-ring-2 inset-shadow-sm inset-shadow-black/25 inset-ring-white/10 transition-all
        hover:outline-black/50 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-75 disabled:brightness-75
    "
        style="background-color: {bg}"
    >
        {text}
    </button>
</a>
