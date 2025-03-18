<script lang="ts">
    export let text: string = "(text)";
    export let bg: string = "#ffffff";
    export let onclick: () => void = () => {};
    export let event: string = "";
    export let disabled: boolean = false;
</script>

<button
    on:click={onclick}
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
