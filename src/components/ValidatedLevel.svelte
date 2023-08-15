<script lang="ts">
    import { fade } from "svelte/transition";
    import Table from "./layout/Table.svelte";
    import type { DetectedLevel } from "../client/FileValidator";
    import { to5bLevelFormat } from "../misc";
    import background from "$lib/assets/backgrounds/0.png"
    import Log from "./Log.svelte";

    export let level: DetectedLevel
    export let i;
    $: opened = false

    const tableSprites = level.sprites
        .map((s) => Object.values(s).filter((v) => v !== undefined))

    const tableDialogues = level.dialogues
        .map((d) => Object.values(d))

    // TODO: Find a better way to get the log level of a validation
    const warningLog = level.logs.find((l) => l.level === "warning") !== undefined
    const errorLog = level.logs.find((l) => l.level === "error") !== undefined
</script>

<!--<div class="flex justify-around">-->
<div>
    <div class="w-[128px] h-[128px] rounded-[10px] shadow-xl cursor-pointer bg-cover select-none" class:warningLog class:errorLog style="background-image: url({background});" on:click={() => opened = !opened}>
<!--        <img class="w-[128px] h-[128px] rounded-[10px]" src="/backgrounds/{level.background}.png"/>-->
<!--        <span class="w-[128px] h-[128px] -top-9 left-2 relative text-white text-2xl font-bold select-none whitespace-nowrap overflow-hidden overflow-ellipsis">{to5bLevelFormat(level.id)}. {level.name}</span>-->
        <span class="px-1.5 text-white text-4xl font-bold z-0 mix-blend-overlay select-none">{to5bLevelFormat(level.id)}</span>
<!--        <span class="bg-black text-sm text-blue-300 relative -top-[134px] -left-[30px]">{level.width} x {level.height}</span>-->
    </div>
<!--    <div class="header" on:click={() => opened = !opened}>-->
<!--        <div class="header-status">-->
<!--            <h1 class="name">{(level.id).toString().padStart(3, "0")}. {level.name}</h1>-->
<!--            <img class="status" src="/{status}.png"/>-->
<!--        </div>-->
<!--        <img class="background" src="/backgrounds/{level.background}.png"/>-->
<!--    </div>-->
    {#if opened}
        <div transition:fade={{duration: 100}} class="w-[700px] absolute bg-green-950 bg-opacity-95 z-10 rounded-lg shadow-xl">
            <p class="text-2xl font-bold p-2">{to5bLevelFormat(level.id)} - {level.name}</p>
            <div class="text-3xl level-props">
                <span class="width">{level.width} x {level.height}</span>
                <span class="type">({level.levelType} mode)</span>
            </div>
            <div class="sprites">
                <!--                        <h2>Sprites</h2>-->
                <Table
                        title="Sprites"
                        heads={["Sprite ID", "X", "Y", "Role ID", "Motion Speed", "Motion Path"]}
                        content={tableSprites}
                />
            </div>
            {#if level.dialogues.length > 0}
                <div class="dialogues">
                    <!--                        <h2>Dialogues</h2>-->
                    <Table
                            title="Dialogues"
                            heads={["Sprite ID", "Emotion", "Text"]}
                            content={tableDialogues}
                    />
                </div>
            {/if}
            <div class="info">
                {#if level.logs.length > 0}
                    <div class="bg-neutral-700 bg-opacity-50 text-neutral-200 rounded p-2.5">
                        {#each level.logs as log}
                            <Log {log}/>
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .warningLog {
        @apply outline outline-4 outline-amber-500 shadow-amber-900;
    }

    .errorLog {
        @apply outline outline-4 outline-red-500 shadow-red-900;
    }

    .validated-level {
        @apply my-4;
        /*padding: 0 10px;*/
        /*margin: 20px 0;*/
        /*color: whitesmoke;*/
        /*background-color: rgba(180, 180, 180, 0.5);*/
        /*outline: 1px solid whitesmoke;*/
        /*box-shadow: 1px 1px 0px 0px black;*/
    }

    .header {
        display: flex;

        padding: 0 10px;
        justify-content: space-between;
        align-items: center;
    }

    .header:hover {
        background-color: rgba(180, 180, 180, 0.65);
        cursor: pointer;
    }

    /*.opened > .header {*/
    /*    background-color: rgba(180, 180, 180, 0.85);*/
    /*}*/

    .header-status {
        display: flex;
        align-items: center;
    }

    .status {
        width: 32px;
        height: 32px;
        padding: 25px;
    }

    .background {
        height: 64px;
    }

    .level-props {
        text-align: center;
    }


    .sprites, .dialogues {
        padding: 10px;
    }

    /*.errors, .warnings {*/
    /*    !*font-family: monospace;*!*/
    /*    font-weight: bold;*/
    /*    font-size: 1.5em;*/
    /*    padding: 4px 20px;*/
    /*    margin: 10px 0;*/
    /*    background-color: #3a3a3a;*/
    /*}*/

    /*.errors {color: orangered;}*/
</style>