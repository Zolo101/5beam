<script lang="ts">
    import type { Levelpack } from "$lib/types";
    import Box from "$lib/assets/box.png";
    import Icon from "../Icon.svelte";
    import { getPlaysString } from "../../misc";
    import Button from "../Button.svelte";

    export let levelpack: Levelpack;

    export let glow: boolean = false;

    $: user = levelpack.creator;
</script>

<a href="/levelpack/{levelpack.id}">
    <div
        class:moddedLevelpack={levelpack.modded}
        class:glow
        class="w-[350px] rounded-lg bg-zinc-700/20 p-2 text-sm text-neutral-50 shadow-sm outline-4 outline-white/10 backdrop-blur-xl backdrop-saturate-200 transition-all hover:outline-white/40"
    >
        <!--    Thumbnail -->
        <div class="flex w-full justify-center">
            <img
                width="128"
                height="128"
                class="rounded-xs"
                src={Box}
                alt="Placeholder Thumbnail"
            />
        </div>
        <div class="flex h-7 justify-between gap-2">
            <p class="overflow-hidden text-xl text-ellipsis whitespace-nowrap">
                {levelpack.title}
            </p>
            <div class="my-1 **:h-6 **:text-sm!">
                {#if !levelpack.modded}
                    <Button
                        text="Play"
                        bg="#4bff5d"
                        href="https://coppersalts.github.io/HTML5b?levelpack={levelpack.id}"
                        event="play-level"
                    />
                {/if}
            </div>
        </div>
        <div class="flex justify-between gap-2">
            <p class="text-ellipsis whitespace-nowrap text-neutral-400">
                by {user.username}
            </p>
            <div class="flex items-end">
                <Icon name="plays" width="13" height="13" />
                <p class="h-[15px] pl-1 text-green-500">
                    {getPlaysString(levelpack.plays)}
                </p>
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
