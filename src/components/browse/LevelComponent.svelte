<script lang="ts">
    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";
    import { getLevelThumbnailURL, getPlaysString } from "../../misc";
    import Icon from "../Icon.svelte";
    import Button from "../Button.svelte";

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
        class="flex w-[350px] flex-col items-start justify-start rounded-lg bg-zinc-800/70 p-2 text-neutral-50 shadow-2xl shadow-black/10 outline-2 outline-white/10 backdrop-blur-xl backdrop-brightness-125 backdrop-contrast-150 transition-all hover:outline-white/40"
    >
        <div class="inline-flex h-full w-full">
            <img class="rounded-xs" src={thumbnailUrl} alt="Level Thumbnail" />
            <div class=" inline h-[35px] w-[35px]">
                <Difficulty difficulty={level.difficulty} />
            </div>
            <!--            <img class="w-[35px] h-[35px] left-[160px] top-[73px] absolute" src="https://via.placeholder.com/35x35" />-->
        </div>
        <div class="flex w-full items-center justify-start">
            <div class="w-full flex-col items-start justify-start">
                <!--                <p class="w-[200px] top-1.5 relative text-xl whitespace-nowrap overflow-hidden text-ellipsis">{level.title}</p>-->
                <div class="flex h-7 justify-between gap-2">
                    <p
                        class="overflow-hidden text-xl text-ellipsis whitespace-nowrap drop-shadow-lg"
                    >
                        {level.title}
                    </p>
                    <div class="my-1 **:h-6 **:text-sm!">
                        {#if !level.modded}
                            <Button
                                text="Play"
                                bg="#4bff5d"
                                href="https://coppersalts.github.io/HTML5b?level={level.id}"
                                event="play-level"
                            />
                        {/if}
                    </div>
                </div>
                <div class="flex justify-between gap-2 text-sm">
                    <div class="grow text-neutral-400">
                        <span>by</span>
                        <span class="overflow-hidden text-ellipsis whitespace-nowrap">
                            {user.username}
                        </span>
                    </div>
                    <div class="flex items-end">
                        <Icon name="plays" width="13" height="13" />
                        <p class="h-[15px] pl-1 text-green-500">
                            {getPlaysString(level.plays)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</a>
