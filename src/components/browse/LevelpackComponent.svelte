<script lang="ts">

    import User from "../UserComponent.svelte";

    export let levelpack: any
    console.log(levelpack)
</script>

<div class="levelpack">
    <div class="header">
        <span class="title">{levelpack.title}</span>
    </div>
    <div class="info">
        <User prefix="by" user={levelpack.creator}/>
        <p class="description">{levelpack.description}</p>
    </div>
</div>

<style>
    .levelpack {
        box-shadow: 2px 2px 0px 6px black;
        padding: 10px;
        background-color: rgba(98, 98, 98, 0.75);
        backdrop-filter: blur(5px) invert();
        border-radius: 2px;
        transition: box-shadow 0.3s;

        min-height: 140px;
    }

    .levelpack:hover {
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