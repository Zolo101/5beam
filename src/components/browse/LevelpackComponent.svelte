<script lang="ts">
    import type { Levelpack } from "$lib/types";
    import Box from "$lib/assets/box.png";
    import Icon from "../Icon.svelte";
    import { getPlaysString } from "../../misc";

    export let levelpack: Levelpack;

    export let glow: boolean = false;

    $: user = levelpack.creator;
</script>

<a href="/levelpack/{levelpack.id}">
    <div
        class:modded={levelpack.modded}
        class:glow
        class="relative h-[158px] w-[309px] rounded-[5px] bg-zinc-700/20 text-neutral-50 shadow-sm outline outline-4 outline-white/10 backdrop-blur-xl backdrop-saturate-200 transition-all hover:outline-white/40"
    >
        <!--    Thumbnail -->
        <div class="flex w-full justify-center">
            <img
                width="128"
                height="128"
                class="rounded-xs bg-contain"
                src={Box}
                alt="Placeholder Thumbnail"
            />
        </div>
        <p
            class="absolute top-[115px] left-[7px] h-6 w-[300px] overflow-hidden text-xl text-ellipsis whitespace-nowrap"
        >
            {levelpack.title}
        </p>
        <p
            class="absolute top-[137px] left-[7px] h-3 w-[233px] text-[13px] text-ellipsis whitespace-nowrap text-neutral-400"
        >
            by {user.username}
        </p>
        <div
            class="absolute top-[119px] left-[180px] inline-flex h-[17px] w-[22px] items-end justify-start gap-px"
        >
            <div class="relative top-[20px] left-[80px] flex items-end">
                <Icon name="plays" width="13" height="13" />
                <p class="relative h-[15px] w-[39px] pl-1 text-[13px] text-green-500">
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

<style>
    .modded {
        /* TODO: Too much? */
        @apply bg-purple-900 text-purple-400 outline-purple-400/40;
    }

    .glow {
        @apply outline-white/40;
    }
</style>
