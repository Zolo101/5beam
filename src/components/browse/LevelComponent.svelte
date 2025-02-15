<script lang="ts">
    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";
    import { getLevelThumbnailURL, getPlaysString } from "../../misc";
    import Icon from "../Icon.svelte";

    export let level: Level;

    export let glow: boolean = false;

    $: user = level.creator;
    $: thumbnailUrl = getLevelThumbnailURL(level.id, level.thumbnail, true);
</script>

<a href="/level/{level.id}">
    <!--    <div class:modded={level.modded} class:glow={glow} class="w-[209px] h-[158px] p-[7px] bg-zinc-800 text-neutral-50 rounded-[5px] shadow-sm flex-col justify-start items-start inline-flex outline outline-white/10">-->
    <div
        class:modded={level.modded}
        class:glow
        class="inline-flex h-[234px] w-[349px] flex-col items-start justify-start rounded-[5px] bg-zinc-800/60 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
    >
        <div class="relative h-full w-full">
            <img
                class="absolute top-0 left-0 h-full w-full rounded-xs object-cover"
                src={thumbnailUrl}
                alt="Level Thumbnail"
            />
            <div class="absolute right-0 bottom-0 h-[35px] w-[35px]">
                <Difficulty difficulty={level.difficulty} />
            </div>
            <!--            <img class="w-[35px] h-[35px] left-[160px] top-[73px] absolute" src="https://via.placeholder.com/35x35" />-->
        </div>
        <div class="inline-flex h-9 items-center justify-start pr-[62px]">
            <div class="relative flex w-full flex-col items-start justify-start">
                <!--                <p class="w-[200px] top-1.5 relative text-xl whitespace-nowrap overflow-hidden text-ellipsis">{level.title}</p>-->
                <p
                    class="relative top-1.5 w-[290px] overflow-hidden text-xl text-ellipsis whitespace-nowrap drop-shadow-lg"
                >
                    {level.title}
                </p>
                <div class="relative bottom-2 flex w-[289px] justify-between">
                    <div class="relative top-2.5 h-5 w-[151px] text-neutral-400">
                        <p class="absolute top-0 left-0 text-[13px]">by</p>
                        <p
                            class="absolute top-0 left-[18px] h-5 w-[228px] overflow-hidden text-[13px] text-ellipsis whitespace-nowrap"
                        >
                            {user.username}
                        </p>
                    </div>
                    <div class="relative left-[40px] flex w-[39px]">
                        <div class="relative top-[5px] right-[3px] flex items-end">
                            <Icon name="plays" width="13" height="13" />
                            <p class="h-[15px] w-[39px] pl-1 text-[13px] text-green-500">
                                {getPlaysString(level.plays)}
                            </p>
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
        @apply mx-10 p-2 text-4xl font-bold text-neutral-300;
    }
</style>
