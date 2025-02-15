<script lang="ts">
    export let text: string = "(text)";
    export let bg: string = "#ffffff";
    export let href: string = "#";
    export let onclick: () => void = () => {};
    export let disabled: boolean = false;
</script>

<a {href} on:click={onclick}>
    <button
        {disabled}
        class="
        relative h-[40px] w-[246px] cursor-pointer rounded-[10px] shadow-lg outline outline-4 outline-transparent transition-all hover:outline-black/50
        disabled:cursor-not-allowed disabled:opacity-40 disabled:outline-hidden
    "
        style="background-color: {bg}"
    >
        <span
            class="absolute top-0 left-0 h-[40px] w-[246px] rounded-lg bg-linear-to-b from-transparent to-[#00000044]"
        ></span>
        <span
            class="absolute top-1 left-0 h-[40px] w-[246px] text-center text-2xl font-normal text-black"
            >{text}</span
        >
    </button>
</a>
