<script lang="ts">
    export let directory: string[]
    export let oppositeSlash: boolean = false

    const slash = oppositeSlash ? "\\" : "/";
</script>

<div class="filepath">
    {#each directory as folder, i}
        {#if i > 0}
            <span class="filepath-slash">{slash}</span>
        {/if}
        <span class="filepath-folder">{folder}</span>
    {/each}
</div>

<style>
    .filepath {
        display: inline-flex;
        align-items: center;
    }

    .filepath-slash {
        height: 37px;
        padding: 0 7px 0 9px;
        font-size: 1.5em;
        font-weight: normal;
        color: #adadad;
    }
</style>