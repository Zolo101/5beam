<script lang="ts">
    export let text: string = "(text)";
    export let bg: string = "#ffffff";
    export let href: string = "#";
    export let onclick: () => void = () => {};
    export let event: string = "";
    export let disabled: boolean = false;
    export let newWindow: boolean = false;
</script>

<a {href} on:click={onclick} target={newWindow ? "_blank" : "_self"}>
    <button
        {disabled}
        data-umami-event={event}
        class="
        h-24 w-full cursor-pointer text-black/75 inset-ring-2 inset-shadow-sm inset-shadow-black/25 inset-ring-white/10 transition-all
        hover:outline-black/50 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-75 disabled:brightness-75
    "
        style="background-color: {bg}"
    >
        {text}
    </button>
</a>
