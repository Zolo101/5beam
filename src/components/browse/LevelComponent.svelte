<script lang="ts">
    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";
    import { getLevelThumbnailURL, getPlaysString } from "../../misc";
    import Icon from "../Icon.svelte";

    export let level: Level;

    export let glow: boolean = false

    $: user = level.creator;
    $: thumbnailUrl = getLevelThumbnailURL(level.id, level.thumbnail, true)
</script>

<a href="/level/{level.id}">
<!--    <div class:modded={level.modded} class:glow={glow} class="w-[209px] h-[158px] p-[7px] bg-zinc-800 text-neutral-50 rounded-[5px] shadow flex-col justify-start items-start inline-flex outline outline-white/10">-->
    <div class:modded={level.modded} class:glow={glow} class="w-[349px] h-[234px] p-2 bg-zinc-800/60 backdrop-blur-xl backdrop-contrast-150 backdrop-brightness-125 text-neutral-50 rounded-[5px] shadow-2xl shadow-black/10 flex-col justify-start items-start inline-flex outline outline-white/10 transition-all hover:outline-white/40">
        <div class="w-full h-full relative">
            <img class="w-full h-full left-0 top-0 absolute rounded-sm object-cover" src={thumbnailUrl} alt="Level Thumbnail"/>
            <div class="w-[35px] h-[35px] right-0 bottom-0 absolute">
                <Difficulty difficulty={level.difficulty}/>
            </div>
<!--            <img class="w-[35px] h-[35px] left-[160px] top-[73px] absolute" src="https://via.placeholder.com/35x35" />-->
        </div>
        <div class="h-9 pr-[62px] justify-start items-center inline-flex">
            <div class="w-full relative flex-col justify-start items-start flex">
<!--                <p class="w-[200px] top-1.5 relative text-xl whitespace-nowrap overflow-hidden overflow-ellipsis">{level.title}</p>-->
                <p class="w-[290px] top-1.5 relative text-xl whitespace-nowrap overflow-hidden overflow-ellipsis drop-shadow-lg">{level.title}</p>
                <div class="w-[289px] flex justify-between bottom-2 relative">
                    <div class="w-[151px] h-5 top-2.5 relative text-neutral-400">
                        <p class="left-0 top-0 absolute text-[13px]">by</p>
                        <p class="w-[228px] h-5 left-[18px] top-0 absolute text-[13px] whitespace-nowrap overflow-hidden overflow-ellipsis">{user.username}</p>
                    </div>
                    <div class="left-[40px] relative flex w-[39px]">
                        <div class="flex items-end relative right-[3px] top-[5px]">
                            <Icon name="plays" width="13" height="13"/>
                            <p class="w-[39px] h-[15px] text-green-500 text-[13px] pl-1">{getPlaysString(level.plays)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</a>

<style>
    .modded {
        /* TODO: Too much? */
        @apply bg-purple-950 text-purple-500 outline-purple-500/40;
    }

    .glow {
        @apply outline-white/40;
    }

    h2 {
        @apply text-4xl text-neutral-300 font-bold p-2 mx-10;
    }
</style>