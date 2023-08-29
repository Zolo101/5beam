<script lang="ts">
    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";
    import { getLevelThumbnailURL } from "../../misc";
    import Icon from "../Icon.svelte";

    export let level: Level;

    $: user = level.creator;
    const thumbnailUrl = getLevelThumbnailURL(level.id, level.thumbnail, true)
</script>

<a href="/level/{level.id}">
    <div class:modded={level.modded} class="w-[209px] h-[158px] relative bg-zinc-800 text-neutral-50 rounded-[5px] shadow">
    <!--    Thumbnail -->
<!--        <img class="w-[195px] h-[108px] left-[7px] top-[7px] absolute rounded-sm" src="https://via.placeholder.com/195x108" alt="Placeholder Thumbnail"/>-->
        <img class="w-[195px] h-[108px] left-[7px] top-[7px] absolute rounded-sm" src={thumbnailUrl} alt="Level Thumbnail"/>
        <div class="w-[122px] h-6 left-[7px] top-[115px] absolute text-xl font-normal whitespace-nowrap overflow-hidden overflow-ellipsis">{level.title}</div>
        <div class="w-[133px] h-3 left-[7px] top-[137px] absolute text-neutral-400 text-[13px] font-normal whitespace-nowrap overflow-ellipsis">by {user.username}</div>
        <div class="w-[22px] h-[17px] left-[180px] top-[119px] absolute justify-start items-end gap-px inline-flex">
            <div class="relative right-[8px] top-[2.5px]">
                <Icon name="plays" width="13" height="13"/>
            </div>
            <div class="w-[39px] h-[17px] relative right-[5px] text-right text-green-500 text-[13px] font-normal">{level.plays}</div>
        </div>
    <!--    <div class="w-[22px] h-[17px] pb-px left-[180px] top-[137px] absolute justify-start items-center gap-px inline-flex">-->
    <!--        <div class="w-[30px] text-right text-yellow-400 text-[13px] font-normal">{level.stars}</div>-->
    <!--    </div>-->

    <!--    Difficulty Icon -->
    <!--    <img class="w-[35px] h-[35px] left-[167px] top-[80px] absolute" src="https://via.placeholder.com/35x35"/>-->
        <div class="w-[35px] h-[35px] left-[167px] top-[80px] absolute">
            <Difficulty difficulty={level.difficulty}/>
        </div>
    </div>
</a>

<style>
    .modded {
        /* TODO: Too much? */
        @apply bg-purple-950 text-purple-500;
    }
</style>