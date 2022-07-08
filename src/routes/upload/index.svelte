<script lang="ts">
    import { isLoggedIn } from "../../misc";
    import { postCreateLevelClient } from "../../components/ClientSideAPI";

    const loggedIn = isLoggedIn();

    function onSubmit(event: any) {
        const formData = new FormData(event.target)
        // TODO: Find better type for this
        const file: File = formData.get("file") as any
        if (file.size > 1_000_000) alert("File too big! (1MB MAX)")
        postCreateLevelClient(formData)
    }
</script>

{#if loggedIn}
    <div class="upload">
        <form on:submit|preventDefault={onSubmit}>
            <h2>Title</h2>
            <input type="text" name="title" required maxlength="64" placeholder="Title">

            <h2>Description</h2>
            <textarea name="description" rows="5" cols="33" maxlength="1024" required></textarea>

            <h2>Upload level file (single levels only rn)</h2>
            <input type="file" name="file" required>
            <br><br>
            <input type="submit" value="Upload" class="upload-button">
        </form>
    </div>
{:else}
    <h1 class="not-logged-in">only users can upload levels 😡</h1>
{/if}

<style>
    input, textarea {
        font-size: 1.5em;
        border-radius: 4px;
    }

    .upload {
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