<script lang="ts">
    import Button from "../Button.svelte";
    import type { Level, User } from "$lib/types";
    import UserComponent from "../UserComponent.svelte";

    export let level: Level

    let user: User = level.expand.creator
    console.log(level)
</script>

<svelte:head>
    <title>{level.title} - 5beam</title>
    <meta property="og:title" content={level.title}/>
    <meta property="og:description" content={level.description}/>
</svelte:head>

<!--<div class="level">-->
<!--    <div class="header">-->
<!--        <span class="title">{level.title}</span>-->
<!--        <Difficulty difficulty={level.difficulty}/>-->
<!--        <User prefix="by" id={level.creator}/>-->
<!--    </div>-->
<!--    <div class="profile">-->
<!--        <div class="main">-->
<!--&lt;!&ndash;            <Star amount={level.stars}/>&ndash;&gt;-->
<!--            <p>{level.description}</p>-->
<!--        </div>-->
<!--        <div class="info">-->
<!--            <Table content={[-->
<!--                ["Created on", formatDate_Full(level.created)],-->
<!--                ["Plays", level.plays],-->
<!--                //["Stars", level.stars],-->
<!--                ["Difficulty", `${difficultyMap.get(level.difficulty)} (${level.difficulty})`],-->
<!--            ]}></Table>-->
<!--            <br>-->
<!--&lt;!&ndash;            <button>Download Levelpack (not working yet)</button>&ndash;&gt;-->
<!--        </div>-->
<!--    </div>-->
<!--</div>-->

<div class="flex flex justify-center pt-20 pb-5">
<!--    <div class="bg-neutral-300 w-[480px] h-[270px]"></div>-->
    <div class="bg-neutral-300 w-[720px] h-[405px]"></div>
<!--<div class="w-[952px] h-[924px] relative bg-white bg-opacity-20 flex-col justify-start items-start inline-flex">-->
<!--    <div class="justify-center items-center gap-3 inline-flex">-->
<!--        <div class="w-[45px] h-[0px] relative origin-top-left rotate-180"></div>-->
<!--        <div class="w-[66px] h-[46px] bg-gradient-to-b from-white to-neutral-600 rounded-[10px] justify-center items-center flex">-->
<!--            <div class="w-[66px] h-[46px] text-center text-neutral-500 text-[32px] font-bold">0</div>-->
<!--        </div>-->
<!--        <div class="w-[45px] h-[0px] relative"></div>-->
<!--    </div>-->
    <div class="m-10 flex-col items-center gap-2.5 inline-flex">
<!--        <div class="w-[707px] h-[69px]"><span class="text-white text-[64px] font-black">Lo</span><span class="text-white text-[64px]">rem Ipsum</span></div>-->
        <div class="text-center">
            <p class="w-[400px] text-white text-5xl m-4">{level.title}</p>
            <p class="text-white text-2xl"><UserComponent prefix="by" {user}/></p>
        </div>
        <div class="flex flex-col gap-5 p-5">
            <Button text="Play" bg="#4bff5d"/>
            <Button text="Download" bg="#4bffff"/>
        </div>
    </div>
<!--</div>-->
</div>
<div class="w-full px-2 pt-4 bg-black bg-opacity-50 rounded-[5px] shadow justify-center items-center inline-flex">
    <div class="self-stretch justify-center items-center gap-[55px] inline-flex">
        <div class="w-32 h-[98.01px] relative">
            <div class="w-[90px] h-[65px] left-[38px] top-[33.01px] absolute">
                <div class="w-[159.55px] h-[65px] left-[-115px] top-0 absolute text-right text-green-500 text-5xl">0</div>
            </div>
            <div class="w-32 h-[49px] left-0 top-0 absolute text-center text-2xl">Total views</div>
        </div>
        <div class="w-[120px] h-[98.73px] relative">
            <div class="w-[86px] h-[65px] pt-px pb-[2.71px] left-[34px] top-[33.73px] absolute justify-start items-center gap-[0.31px] inline-flex">
                <div class="w-[117.78px] h-[61.29px] text-right text-yellow-400 text-5xl">0</div>
            </div>
            <div class="w-[120px] h-[49px] left-0 top-0 absolute text-center text-2xl">Total stars</div>
        </div>
<!--        <div class="w-[129.50px] h-[98.07px] relative">-->
<!--            <div class="w-[90px] h-[65px] left-[39.50px] top-[33.07px] absolute">-->
<!--                <div class="w-[159.55px] h-[65px] left-[-115px] top-0 absolute text-right text-fuchsia-500 text-5xl">0</div>-->
<!--            </div>-->
<!--            <div class="w-[129px] h-[49px] left-0 top-0 absolute text-center text-2xl">Total levels</div>-->
<!--        </div>-->
        <div class="w-[150.50px] h-[94px] relative">
            <div class="w-[150.50px] h-[68px] left-0 top-[26px] absolute text-center text-amber-500 text-4xl">02-2023</div>
            <div class="w-[112.17px] h-[49px] left-[20.10px] top-0 absolute text-center text-2xl">Created</div>
        </div>
    </div>
</div>
<p class="text-2xl p-5">{level.description}</p>

<!--<br>-->
<!--<button>Download as 5b Level</button><Help text="In beta: Not all levelpacks can be converted!"/>-->

<style>
    .level {
        width: 70%;
        margin: 100px auto 80px auto;
        box-shadow: 0px 0px 4px 1px black;
        background-color: rgba(245, 245, 245, 0.5);
        backdrop-filter: blur(10px);
        border-radius: 2px;
        padding: 20px;
    }

    .header {
        display: flex;
        align-items: center;
    }

    .profile {
        display: flex;
        justify-content: space-between;
    }

    .title {
        font-size: 2.5em;
        font-weight: bold;
    }

    .user {
        font-size: 1.4em;
        font-weight: bold;
    }

    .stars {
        text-align: right;
    }
</style>