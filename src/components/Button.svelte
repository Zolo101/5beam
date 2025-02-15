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
        disabled:cursor-not-allowed disabled:opacity-40 disabled:outline-none
    "
        style="background-color: {bg}"
    >
        <span
            class="absolute left-0 top-0 h-[40px] w-[246px] rounded-lg bg-gradient-to-b from-transparent to-[#00000044]"
        ></span>
        <span
            class="absolute left-0 top-1 h-[40px] w-[246px] text-center text-2xl font-normal text-black"
            >{text}</span
        >
    </button>
</a>
