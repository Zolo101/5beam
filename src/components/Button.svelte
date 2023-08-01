<script lang="ts">
    export let text: string = "(text)";
    export let bg: string = "#ffffff";
</script>

<div class="w-[246px] h-[40px] relative rounded-[10px] shadow-lg" style="background-color: {bg}">
    <div class="w-[246px] h-[40px] left-0 top-0 absolute bg-gradient-to-b from-transparent to-[#00000044] rounded-lg"></div>
    <div class="w-[246px] h-[40px] left-0 top-1 absolute text-center text-black text-2xl font-normal">{text}</div>
</div>