<script lang="ts">
    export let text: string = "(text)";
    export let bg: string = "#ffffff";
    export let href: string = "";
    export let event: string = "";
    export let disabled: boolean = false;
    export let newWindow: boolean = false;
    export let onclick: () => void = () => {};
</script>

<a {href} target={newWindow ? "_blank" : "_self"}>
    <button
        {disabled}
        on:click={onclick}
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
