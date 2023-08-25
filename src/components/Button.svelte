<script lang="ts">
    export let text: string = "(text)";
    export let bg: string = "#ffffff";
    export let href: string = "#";
    export let onclick: () => void = () => {};
    export let disabled: boolean = false;
</script>

<a {href} on:click={onclick} >
    <button {disabled} class="
        w-[246px] h-[40px] relative rounded-[10px] shadow-lg outline outline-4 outline-transparent hover:outline-neutral-800 transition-all cursor-pointer
        disabled:outline-none disabled:opacity-40 disabled:cursor-not-allowed
    " style="background-color: {bg}">
        <span class="w-[246px] h-[40px] left-0 top-0 absolute bg-gradient-to-b from-transparent to-[#00000044] rounded-lg"></span>
        <span class="w-[246px] h-[40px] left-0 top-1 absolute text-center text-black text-2xl font-normal">{text}</span>
    </button>
</a>
