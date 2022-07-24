<script lang="ts">
    import { isLoggedIn } from "../../misc";
    import { postCreateLevelClient, postCreateLevelpackClient } from "../../components/client/ClientSideAPI";
    import Validator from "../../components/Validator.svelte";
    import validate from "../../components/client/FileValidator";

    const loggedIn = isLoggedIn();
    $: page = "level"
    let file: File;
    $: result = undefined;
    $: valid = false

    function onSubmit(event: any) {
        const type = result.levels.length === 1
        const typeName = type ? "level" : "levelpack"
        const func = type ? postCreateLevelClient : postCreateLevelpackClient
        func(new FormData(event.target))
            .then(res => window.location.href = `/${typeName}/${res.id}`)
            .catch(err => {
                console.error(err)
                alert("Unfortunately your upload has failed. Please contact Zelo101#0138 on discord with your level(s).")
            })
    }

    async function validateFile(event: any) {
        valid = false
        file = event.target.files[0]

        if (file.size > 1_000_000) {
            alert("File too big! (1MB MAX)")
            return
        }

        result = validate(await file.text())
        // console.log(result)
        // @ts-ignore
        if (result.errors.length === 0) {
            valid = true
        }

    }
</script>

{#if loggedIn}
    <div class="upload">
        <div class="form">
            {#if page === "start"}
                <p>What are you uploading?</p>
                <div class="choice level-btn"     on:click={() => page = "level"}>Level</div>
                <div class="choice levelpack-btn" on:click={() => page = "levelpack"}>Levelpack</div>
            {:else if page === "level"}
                <form on:submit|preventDefault={onSubmit}>
                    <h2>Title</h2>
                    <input type="text" name="title" required maxlength="64" placeholder="Title">

                    <h2>Description</h2>
                    <textarea name="description" rows="5" cols="33" maxlength="1024" required></textarea>

                    <h2>Upload level file</h2>
                    <input type="file" name="file" on:change={validateFile} required>
                    <br><br>
                    {#if valid}
                        <input type="submit" value="Upload" class="upload-button">
                    {/if}
                </form>
                <br>
                <a class="example" href="http://battlefordreamisland.com/5b/levels.txt" target="_blank">Click here to see an example of a level / levelpack</a>
            {:else if page === "levelpack"}
            {:else if page === 3}
            {/if}
        </div>
        <div>
            <Validator {result}/>
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

    .example {
        text-decoration: underline;
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