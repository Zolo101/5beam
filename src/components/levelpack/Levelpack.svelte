<script lang="ts">
    import type { Level } from "../../lib/prisma";
    import { getUserClient } from "../ClientSideAPI";
    import Table from "../Table.svelte";
    import { difficultyMap } from "../../misc";
    import Difficulty from "../Difficulty.svelte";
    import Star from "../Star.svelte";

    export let level: any
    const userRequest = getUserClient(level.creatorId)
    console.log(level)
</script>

<div class="level">
    <div class="header">
        <span class="title">{level.title}</span>
        <Difficulty difficulty={level.difficulty}/>
        <span class="user">
            {#await userRequest}
                by (Loading...)
            {:then user}
                by {user.name}
            {:catch error}
                <span class="error">by Unknown</span>
        <!--            <p class="error">Error while requesting user: {error}</p>-->
            {/await}
        </span>
    </div>
    <div class="profile">
        <div class="main">
<!--            <Star amount={level.stars}/>-->
            <p>{level.description}</p>
        </div>
        <div class="info">
            <Table content={[
                ["Created on", level.createdAt],
                ["Plays", level.plays],
                ["Stars", level.stars],
                ["Difficulty", `${difficultyMap.get(level.difficulty)} (${level.difficulty})`],
            ]}></Table>
            <br>
<!--            <button>Download Levelpack (not working yet)</button>-->
        </div>
    </div>
</div>

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