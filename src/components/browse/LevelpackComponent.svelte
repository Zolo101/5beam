<script lang="ts">
    import type { Levelpack } from "$lib/types";
    import Box from "$lib/assets/box.png"
    import Icon from "../Icon.svelte";
    import { getPlaysString } from "../../misc";

    export let levelpack: Levelpack;

    export let glow: boolean = false

    $: user = levelpack.creator;
</script>

<a href="/levelpack/{levelpack.id}">
    <div class:modded={levelpack.modded} class:glow={glow} class="w-[309px] h-[158px] relative bg-zinc-700/20 backdrop-blur-xl backdrop-saturate-200 text-neutral-50 rounded-[5px] shadow outline outline-4 outline-white/10 transition-all hover:outline-white/40">
        <!--    Thumbnail -->
        <div class="flex w-full justify-center">
            <img width="128" height="128" class="rounded-sm bg-contain" src={Box} alt="Placeholder Thumbnail"/>
        </div>
        <p class="w-[300px] h-6 left-[7px] top-[115px] absolute text-xl whitespace-nowrap overflow-hidden overflow-ellipsis">{levelpack.title}</p>
        <p class="w-[233px] h-3 left-[7px] top-[137px] absolute text-neutral-400 text-[13px] whitespace-nowrap overflow-ellipsis">by {user.username}</p>
        <div class="w-[22px] h-[17px] left-[180px] top-[119px] absolute justify-start items-end gap-px inline-flex">
            <div class="flex items-end relative left-[80px] top-[20px]">
                <Icon name="plays" width="13" height="13"/>
                <p class="w-[39px] h-[15px] relative text-green-500 text-[13px] pl-1">{getPlaysString(levelpack.plays)}</p>
            </div>
        </div>
        <!--    <div class="w-[22px] h-[17px] pb-px left-[180px] top-[137px] absolute justify-start items-center gap-px inline-flex">-->
        <!--        <div class="w-[30px] text-right text-yellow-400 text-[13px] font-normal">{level.stars}</div>-->
        <!--    </div>-->

        <!--    Difficulty Icon -->
        <!--    <img class="w-[35px] h-[35px] left-[167px] top-[80px] absolute" src="https://via.placeholder.com/35x35"/>-->
    <!--    <div class="w-[35px] h-[35px] left-[167px] top-[80px] absolute">-->
    <!--        <Difficulty difficulty={levelpack.difficulty}/>-->
    <!--    </div>-->
    </div>
</a>

<style>
    .modded {
        /* TODO: Too much? */
        @apply bg-purple-900 text-purple-400 outline-purple-400/40;
    }

    .glow {
        @apply outline-white/40;
    }
</style>