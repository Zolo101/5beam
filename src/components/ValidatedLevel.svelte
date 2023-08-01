<script lang="ts">
    import Table from "./layout/Table.svelte";

    export let level;
    export let i;
    let opened = false;
    let status = "valid"
    // console.log(level.errors)
    if (level.warnings.length > 0) status = "warning"
    if (level.errors.length > 0) status = "error"
</script>

<div class="validated-level" class:opened>
    <div class="header" on:click={() => opened = !opened}>
        <div class="header-status">
            <h1 class="name">{(level.id).toString().padStart(3, "0")}. {level.name}</h1>
            <img class="status" src="/{status}.png"/>
        </div>
        <img class="background" src="/backgrounds/{level.background}.png"/>
    </div>
    {#if opened}
        <div class="level-props">
            <span class="width">{level.width},</span>
            <span class="height">{level.height},</span>
            <span class="spriteNumber">{level.spriteNumber},</span>
            <span class="background">{level.background},</span>
            <span class="type">{level.levelType}</span>
        </div>
        <div class="sprites">
            <!--                        <h2>Sprites</h2>-->
            <Table
                    title="Sprites"
                    heads={["Sprite ID", "X", "Y", "Role ID", "Motion Speed", "Motion Path"]}
                    content={level.sprites.map((d) => Object.values(d))}
            />
        </div>
        <div class="dialogues">
            <!--                        <h2>Dialogues</h2>-->
            <Table
                    title="Dialogues"
                    heads={["Sprite ID", "Emotion", "Text"]}
                    content={level.dialogues.map((d) => Object.values(d))}
            />
        </div>
        <div class="info">
            {#if level.warnings.length > 0}
                <div class="warnings">
                    <h2>Warning(s):</h2>
                    {#each level.warnings as warning}
                        <p>{warning}</p>
                    {/each}
                </div>
            {/if}
            {#if level.errors.length > 0}
                <div class="errors">
                    <h2>Error(s):</h2>
                    {#each level.errors as error}
                        <p>{error}</p>
                    {/each}
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .validated-level {
        /*padding: 0 10px;*/
        margin: 20px 0;
        color: whitesmoke;
        background-color: rgba(180, 180, 180, 0.5);
        outline: 1px solid whitesmoke;
        box-shadow: 1px 1px 0px 0px black;
    }

    .opened {
        background-color: rgba(106, 106, 106, 0.8);
        backdrop-filter: blur(4px);
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

    span {
        font-size: 2em;
    }

    .errors, .warnings {
        /*font-family: monospace;*/
        font-weight: bold;
        font-size: 1.5em;
        padding: 4px 20px;
        margin: 10px 0;
        background-color: #3a3a3a;
    }

    .errors {color: orangered;}
    .warnings {color: orange;}
</style>