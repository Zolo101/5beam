<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "$lib/components/UserComponent.svelte";
    import Button from "$lib/components/Button.svelte";
    import Difficulty from "$lib/components/Difficulty.svelte";
    import { formatDate_Day, getLevelThumbnailURL } from "$lib/misc";
    import Icon from "$lib/components/Icon.svelte";
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import FiveBStyle from "$lib/components/FiveBStyle.svelte";
    import Dropzone from "svelte-file-dropzone";
    import { generateThumbnail } from "$lib/talk/create";
    import LevelInfo from "$lib/components/LevelInfo.svelte";
    import validate from "$lib/client/FileValidator";
    import BigButton from "$lib/components/BigButton.svelte";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let { level, relatedLevels, user } = $derived(data);
    let {
        id,
        title,
        description,
        thumbnail,
        difficulty,
        plays,
        featured,
        creator,
        modded,
        created
    } = $derived(level);
    const creatorName = $derived(creator?.username ?? "Guest");
    const thumbnailUrl = $derived(getLevelThumbnailURL(id, thumbnail, false));
    let editMode = $state(false);
    let showDifference = $state(false);

    let isOwner = $derived(creator?.id === user?.id);

    function downloadLevel() {
        const a = document.createElement("a");
        const blob = new Blob([level.data], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        a.setAttribute("href", url);
        a.setAttribute("download", `levels.txt`);

        a.click();
    }

    function deleteLevel() {
        console.log("deleteLevel");
    }

    function saveLevel() {
        console.log("saveLevel");
    }

    let eventStore = $state<CustomEvent<{ acceptedFiles: File[] }>>();
    let file = $derived(eventStore?.detail?.acceptedFiles[0]);
    let levelDataJSON = $derived.by(async () => {
        if (!file) return;
        return validate(await file.text()).levels[0];
    });

    let fileThumbnail = $derived.by(async () => {
        if (!file) return;
        return await (await generateThumbnail(await file.text())).blob();
    });
</script>

<svelte:head>
    <title>{title} - 5beam</title>
    <meta property="og:title" content={title + " by " + creatorName} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={thumbnailUrl} />
    <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<section class="mt-2 flex flex-col text-neutral-100 max-xl:items-center xl:mx-48">
    <div class="flex items-center gap-2">
        {#if featured}
            <Icon name="starred" width="56" height="56" />
        {/if}
        <span class="mb-1 text-6xl font-bold max-sm:text-center" class:featured>
            {title}
        </span>
    </div>
    <section class="flex text-xl max-md:flex-col max-md:text-xs">
        <span class="text-xl"><UserComponent prefix="by" {creator} /></span>
        <span class="px-1">::</span>
        <span class="font-black"><Difficulty includeText includeImage={false} {difficulty} /></span>
        <span class="px-1">::</span>
        <span class="pr-1 font-black text-green-500">{plays}</span>
        <span class="text-green-500">plays</span>
        <span class="px-1">::</span>
        <span class="font-black text-amber-500">{formatDate_Day(created)}</span>
    </section>
</section>
<div class="flex justify-center gap-5 py-6">
    <img
        class="rounded-sm object-contain shadow-xl"
        src={thumbnailUrl}
        alt="Placeholder Thumbnail"
    />
    <div class="flex flex-col justify-center gap-5 text-3xl font-bold">
        <BigButton
            text="Play"
            bg="#4bff5d"
            href="https://coppersalts.github.io/HTML5b?level={id}"
            event="play-level"
            disabled={!!modded}
        />
        {#if isOwner || data.admin}
            <BigButton
                text="Edit"
                bg="#a8ff00"
                onclick={() => (editMode = !editMode)}
                event="edit-level"
            />
        {/if}
        <BigButton text="Download" bg="#4bffff" onclick={downloadLevel} event="download-level" />
    </div>
</div>

<p class="pl-2.5 text-4xl font-bold">Description</p>
<p class="m-2 rounded-lg bg-neutral-800/90 p-3 text-2xl whitespace-pre-wrap backdrop-blur-sm">
    {description}
</p>

<p class="pl-2.5 text-4xl font-bold">Similar Levels</p>
<div class="flex flex-wrap justify-center gap-5 p-3">
    {#each relatedLevels as level}
        <LevelComponent data={level} />
    {/each}
</div>

<Dialog bind:open={editMode}>
    <div class="relative flex gap-5 overflow-hidden rounded-lg p-5 text-xl">
        <!-- TODO: Make this a form? -->
        <div class="flex flex-col gap-3">
            <div class="flex text-5xl">
                <FiveBStyle text="Edit Level" />
            </div>
            <label for="title" class="text-2xl font-bold">Title</label>
            <input
                name="title"
                class="rounded-lg bg-black/30 p-2.5"
                type="text"
                bind:value={title}
                maxlength="128"
            />
            <label for="description" class="text-2xl font-bold">Description</label>
            <textarea
                name="description"
                class="rounded-lg bg-black/30 p-2.5"
                bind:value={description}
                rows="5"
                cols="33"
                maxlength="1024"
            ></textarea>
            <label for="difficulty" class="text-2xl font-bold">Difficulty</label>
            <div
                class="flex flex-col items-center justify-items-center align-middle text-2xl font-bold"
            >
                <input
                    bind:value={difficulty}
                    type="range"
                    name="difficulty"
                    min="0"
                    step="1"
                    max="7"
                    class="w-full"
                />
                {#key difficulty}<Difficulty {difficulty} includeText />{/key}
            </div>
            <div class="flex justify-end gap-2 *:grow">
                <!-- <button onclick={deleteLevel} class="float-left text-xs opacity-50">Delete</button> -->
                <Button text="Save" bg="#a8ff00" onclick={saveLevel} event="update-level" />
                <Button text="Cancel" bg="#cccccc" onclick={() => (editMode = false)} />
            </div>
        </div>
        <div class="flex flex-col items-center gap-3">
            <Dropzone
                accept="text/plain"
                multiple={false}
                maxSize={1000000}
                required={true}
                disableDefaultStyles={true}
                containerClasses="h-full w-full flex flex-col items-center rounded-sm outline-2 outline-dashed outline-white cursor-pointer"
                on:drop={(e) => (eventStore = e)}
            >
                {#if file}
                    <p class="m-auto text-center text-2xl">
                        {file.name} ({file.size / 1000}KB)
                    </p>
                {:else}
                    <div class="text-x m-auto p-4">
                        <p class="">Drag and drop your file here, or click to select a file!</p>
                        <p class="text-center text-sm">You may only upload a single level file</p>
                    </div>
                {/if}
            </Dropzone>
            {#if file}
                <div class="grid grid-cols-2 gap-3">
                    <p class="text-center">Original</p>
                    <p class="text-center">Updated</p>
                    <img src={thumbnailUrl} width="335" height="184" alt="Level Thumbnail" />
                    {#await fileThumbnail}
                        <div class="m-auto text-sm"><p>Generating...</p></div>
                    {:then thumbnail}
                        <img
                            src={URL.createObjectURL(thumbnail)}
                            width="335"
                            height="184"
                            alt="Level Thumbnail"
                        />
                    {:catch error}
                        <div class="m-auto text-sm">Unable to generate thumbnail...</div>
                    {/await}
                </div>
                <Button
                    text="Show Difference"
                    bg="#8ff0f0"
                    onclick={() => (showDifference = true)}
                />
            {/if}
        </div>
    </div>
    <Dialog bind:open={showDifference}>
        <div class="grid grid-cols-2 gap-3 px-5 pt-5">
            <LevelInfo selectedLevel={validate(level.data).levels[0]} />
            {#await levelDataJSON}
                <div class="m-auto text-sm"><p>Loading...</p></div>
            {:then dataJSON}
                <LevelInfo selectedLevel={dataJSON} />
            {/await}
        </div>
        <div class="flex justify-center p-5 text-xl">
            <Button text="Close" bg="#a8ff00" onclick={() => (showDifference = false)} />
        </div>
    </Dialog>
</Dialog>
