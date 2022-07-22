<script lang="ts">
    import { difficultyColorMap, to5bLevelFormat } from "../../misc";

    export let level: any
</script>


<a href="/level/{level.id}">
    <div class="level" style="background-color: {difficultyColorMap.get(level.difficulty)}">
<!--        <div class="header">-->
<!--            <span class="title">{level.title}</span>-->
<!--            <Difficulty difficulty={level.difficulty}/>-->
<!--        </div>-->
<!--        <div class="info">-->
<!--            <span class="plays">{level.plays} plays,</span>-->
<!--            <span class="stars">{level.stars} stars</span>-->
<!--        </div>-->
        <h1>{to5bLevelFormat(level.levelpackPart)}</h1>
    </div>
</a>

<style>
    h1 {
        font-size: 3em;
        text-align: center;
        margin: 0;
    }

    .level {
        outline: 3px solid black;
        /*box-shadow: 2px 2px 0px 6px black;*/
        /*padding: 10px;*/
        background-color: rgba(98, 98, 98, 0.75);
        backdrop-filter: blur(5px) invert();
        /*border-radius: 2px;*/

        max-height: 50px;
    }

    .level:hover {
        cursor: pointer;
        /*background-color: lightgrey !important;*/
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