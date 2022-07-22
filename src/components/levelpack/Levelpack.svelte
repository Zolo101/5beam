<script lang="ts">
    import * as R from "ramda";
    import Table from "../Table.svelte";
    import { difficultyMap, formatDate_Full } from "../../misc";
    import Difficulty from "../Difficulty.svelte";
    import LevelpackLevelComponent from "../browse/LevelpackLevelComponent.svelte";

    export let levelpack: any
    let difficulties = levelpack.levels.map(level => level.difficulty)
    let levelpackDifficulty = R.sum(difficulties) / difficulties.length; // get average
    console.log(difficulties, levelpackDifficulty)
</script>

<div class="levelpack">
    <div class="header">
        <div class="header-first">
            <span class="title">{levelpack.title}</span>
            <Difficulty difficulty={levelpackDifficulty}/>
            <span class="user">by {levelpack.creator.name}</span>
        </div>
        <span class="levelpack-notice">Levelpack</span>
    </div>
    <div class="profile">
        <div class="main">
            <!--            <Star amount={level.stars}/>-->
            <p>{levelpack.description}</p>
        </div>
        <div class="info">
            <Table content={[
                ["Created on", formatDate_Full(levelpack.createdAt)],
                //["Plays", levelpack.plays],
                //["Stars", levelpack.stars],
                ["Difficulty", `${difficultyMap.get(levelpackDifficulty)} (${levelpackDifficulty})`],
            ]}></Table>
            <br>
            <!--            <button>Download Levelpack (not working yet)</button>-->
        </div>
    </div>
    <div class="levels">
        {#each levelpack.levels as level}
            <LevelpackLevelComponent {level}/>
        {/each}
    </div>
</div>

<!--<br>-->
<!--<button>Download as 5b Level</button><Help text="In beta: Not all levelpacks can be converted!"/>-->

<style>
    .levelpack {
        width: 70%;
        margin: 100px auto 80px auto;
        box-shadow: 0px 0px 4px 1px black;
        background-color: rgba(245, 245, 245, 0.5);
        backdrop-filter: blur(10px);
        border-radius: 2px;
        padding: 20px;
    }

    .header-first {
        display: flex;
        align-items: center;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
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

    .levelpack-notice {
        font-weight: bold;
        font-size: 2.5em;
        color: darkolivegreen;
    }

    .stars {
        text-align: right;
    }

    .levels {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        grid-auto-rows: 1fr;
        grid-gap: 20px;
    }
</style>