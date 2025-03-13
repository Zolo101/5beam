<script lang="ts">
    export let text: string = "(text)";
    export let bg: string = "#ffffff";
    export let href: string = "#";
    export let onclick: () => void = () => {};
    export let event: string = "";
    export let disabled: boolean = false;
</script>

<a {href} on:click={onclick}>
    <button
        {disabled}
        data-umami-event={event}
        class="
        h-[40px] cursor-pointer text-black transition-all hover:outline-black/50 hover:brightness-75
        disabled:cursor-not-allowed
    "
        style="background-color: {bg}"
    >
        {text}
    </button>
</a>
