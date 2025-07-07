<script lang="ts">
    interface Props {
        text?: string;
        bg?: string;
        href?: string;
        event?: string;
        disabled?: boolean;
        newWindow?: boolean;
        onclick?: () => void;
    }

    let {
        text = "(text)",
        bg = "#ffffff",
        href = "",
        event = "",
        disabled = false,
        newWindow = false,
        onclick = () => {}
    }: Props = $props();
</script>

<a {href} target={newWindow ? "_blank" : "_self"}>
    <button
        {disabled}
        {onclick}
        data-umami-event={event}
        class="
        button h-[40px] cursor-pointer text-black inset-shadow-xs inset-shadow-black/50 transition-all hover:outline-black/50 hover:brightness-75
        disabled:cursor-not-allowed disabled:opacity-75 disabled:brightness-75
        "
        style="background-color: {bg}"
    >
        {text}
    </button>
</a>
