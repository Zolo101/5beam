<script lang="ts">
    export let text: string;
</script>

<div class="help">
    <span class="help-text">?</span>
    <span class="help-hovertext">> {text}</span>
</div>

<style>
    .help {
        position: relative;
        display: inline-block;
    }

    .help {
        font-weight: bold;
        font-size: 0.8rem;
        background-color: lightcyan;
        border: 1px solid darkcyan;
        padding: 3px 7px;
        margin: 0 0 0 10px;
        border-radius: 5px;
    }

    .help .help-hovertext {
        position: absolute;
        visibility: hidden;
    }

    .help:hover {
        cursor: help;
    }

    .help:hover .help-hovertext {
        position: relative;
        visibility: visible;
    }
</style>
