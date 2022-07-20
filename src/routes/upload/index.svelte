<script lang="ts">
    import { isLoggedIn } from "../../misc";
    import { postCreateLevelClient } from "../../components/client/ClientSideAPI";
    import Validator from "../../components/Validator.svelte";

    const loggedIn = isLoggedIn();

    function onSubmit(event: any) {
        const formData = new FormData(event.target)
        // TODO: Find better type for this
        const file: File = formData.get("file") as any
        validateFile(file)


        postCreateLevelClient(formData)
    }

    function validateFile(file: File) {
        if (file.size > 1_000_000) alert("File too big! (1MB MAX)")

    }


    $: page = "start"
    $: file = ""
</script>

{#if loggedIn}
    <div class="upload">
        <div class="form">
            {#if page == "start"}
                <p>What are you uploading?</p>
                <div class="choice level-btn"     on:click={() => page = "level"}>Level</div>
                <div class="choice levelpack-btn" on:click={() => page = "levelpack"}>Levelpack</div>
            {:else if page == "level"}
                    <form on:submit|preventDefault={onSubmit}>
                        <h2>Title</h2>
                        <input type="text" name="title" required maxlength="64" placeholder="Title">

                        <h2>Description</h2>
                        <textarea name="description" rows="5" cols="33" maxlength="1024" required></textarea>

                        <h2>Upload level file</h2>
                        <input type="file" name="file" required>
                        <br><br>
                        <input type="submit" value="Validate" class="upload-button">
                    </form>
            {:else if page == "levelpack"}
            {:else if page == 3}
            {/if}
        </div>
        <div>
            <Validator {file}/>
        </div>
    </div>
{:else}
    <h1 class="not-logged-in">only users can upload levels 😡</h1>
{/if}

<style>
    .upload {
        display: flex;
        flex-direction: row;
    }

    .upload > div {
        width: 50%;
    }

    .choice {
        width: 50%;
        margin: 25px;
        outline: 1px solid whitesmoke;
        color: black;
        font-size: 4em;
        text-align: center;
    }

    .choice:hover {
        outline: 1px solid black;
        cursor: pointer;
    }

    .level-btn {background-color: lightgreen}
    .levelpack-btn {background-color: cornflowerblue}

    input, textarea {
        font-size: 1.5em;
        border-radius: 4px;
    }

    .form {
        color: whitesmoke;
    }

    .upload-button {
        text-align: center;
    }

    .not-logged-in {
        font-size: 5em;
        color: whitesmoke;
        text-align: center;
    }
</style>