<script lang="ts">
    interface Props {
        text?: string;
        bg?: string;
        onclick?: () => void;
        event?: string;
        disabled?: boolean;
    }

    let {
        text = "(text)",
        bg = "#ffffff",
        onclick = () => {},
        event = "",
        disabled = false
    }: Props = $props();
</script>

<button
    {onclick}
    {disabled}
    data-umami-event={event}
    class="
    mx-1 h-[40px] cursor-pointer text-black inset-shadow-xs inset-shadow-black/50 transition-all hover:outline-black/50 hover:brightness-75
    disabled:cursor-not-allowed disabled:opacity-75 disabled:brightness-75
    "
    style="background-color: {bg}"
>
    {text}
</button>
