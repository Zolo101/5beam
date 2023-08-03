<script lang="ts">
    import type { Level } from "$lib/types";
    import Difficulty from "../Difficulty.svelte";

    export let level: Level;

    let user = level.expand?.creator;
</script>

<div class="w-[209px] h-[158px] relative bg-zinc-800 rounded-[5px] shadow">
<!--    Thumbnail -->
    <img class="w-[195px] h-[108px] left-[7px] top-[7px] absolute rounded-sm" src="https://via.placeholder.com/195x108" alt="Placeholder Thumbnail"/>
    <div class="w-[122px] h-6 left-[7px] top-[115px] absolute text-white text-xl font-normal whitespace-nowrap overflow-hidden overflow-ellipsis">{level.title}</div>
    <div class="w-[133px] h-3 left-[7px] top-[137px] absolute text-neutral-400 text-[13px] font-normal whitespace-nowrap overflow-ellipsis">by {user.username}</div>
    <div class="w-[22px] h-[17px] left-[180px] top-[119px] absolute justify-start items-end gap-px inline-flex">
        <div class="w-[39px] h-[17px] text-right text-green-500 text-[13px] font-normal">{level.plays}</div>
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

<!--<div class="level">-->
<!--    <div class="header">-->
<!--        <span class="title">{level.title}</span>-->
<!--        <Difficulty difficulty={level.difficulty}/>-->
<!--    </div>-->
<!--    <div class="info">-->
<!--        <User prefix="by" id={level.creator}/>-->
<!--        <span class="plays">{level.plays} plays,</span>-->
<!--        <span class="stars">{level.stars} stars</span>-->
<!--        <p class="description">{level.description}</p>-->
<!--    </div>-->
<!--</div>-->

<style>
    .level {
        box-shadow: 2px 2px 0px 6px black;
        padding: 10px;
        background-color: rgba(98, 98, 98, 0.75);
        backdrop-filter: blur(5px) invert();
        border-radius: 2px;
        transition: box-shadow 0.3s;

        min-height: 140px;
    }

    .level:hover {
        cursor: pointer;
        box-shadow: 0px 0px 0px 3px whitesmoke;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .user {
        font-weight: bold;
    }

    .title {
        text-overflow: ellipsis;
        overflow: hidden;

        font-size: 1.6em;
        font-weight: bold;
        margin: 0;
    }

    .description {
        text-overflow: ellipsis;
        overflow: hidden;

        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        margin: 10px 0;
    }

    .plays {
        color: whitesmoke;
        text-align: right;
        margin: 0;
    }

    .stars {
        color: gold;
        text-align: right;
        margin: 0;
    }
</style>