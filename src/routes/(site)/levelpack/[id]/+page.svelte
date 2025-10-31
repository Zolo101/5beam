<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "$lib/components/UserComponent.svelte";
    import Button from "$lib/components/Button.svelte";
    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import Box from "$lib/assets/box.png";
    import { formatDate_Day } from "$lib/misc";
    import Dialog from "$lib/components/Dialog.svelte";
    import Validator from "$lib/components/Validator.svelte";
    import FiveBStyle from "$lib/components/FiveBStyle.svelte";
    import Dropzone from "svelte-file-dropzone";
    import validate from "$lib/client/FileValidator";
    import BigButton from "$lib/components/BigButton.svelte";
    import Icon from "$lib/components/Icon.svelte";
    import Carousel from "$lib/components/Carousel.svelte";
    import { postModifyLevelpackClient } from "$lib/client/ClientSideAPI";
    import ReportDialog from "$lib/components/ReportDialog.svelte";

    const { data }: { data: PageData } = $props();

    const { levelpack, user } = data;

    let { id, title, description, plays, featured, creator, modded, created, levels } =
        $derived(levelpack);

    const creatorName = $derived(creator?.username ?? "Guest");
    const originalLevelpackFileData = $derived(levels.map((level) => level.data).join("\n\n"));

    function downloadLevelpack() {
        const a = document.createElement("a");
        const blob = new Blob([originalLevelpackFileData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        a.setAttribute("href", url);
        a.setAttribute("download", `levels.txt`);

        a.click();
    }

    function deleteLevelpack() {
        console.log("deleteLevelpack");
    }

    async function saveLevelpack() {
        editSending = true;

        const payload = {
            title: title,
            description: description,
            difficulty: await updatedLevelpackDifficulties,
            modded: modded,
            file: await updatedLevelpackData
        };

        // TODO: Maybe we should just coalesce this into "edit-level"
        // @ts-ignore
        window.umami?.track("edit-levelpack");

        postModifyLevelpackClient(payload, id)
            .then(() => {
                editMode = false;

                // To update the thumbnails
                location.reload();
            })
            .catch((err) => {
                console.error(err);

                // @ts-ignore
                window.umami?.track("edit-levelpack-failed");

                alert(
                    "Unfortunately your edit has failed. Please contact @zelo101 on discord with your level(s)."
                );
            });
    }

    function createDifficultyArray() {
        let r = [];
        for (let i = 0; i < 200; i++) {
            if (levels[i]) {
                r.push(levels[i].difficulty);
            } else {
                r.push(0);
            }
        }
        return r;
    }

    let editMode = $state(false);
    let editSending = $derived(false);

    let reportMode = $state(false);
    let reportSending = $state(false);

    $effect(() => {
        if (!editMode) editSending = false;
    });

    let isOwner = $derived(creator?.id === user?.record.id);
    let eventStore = $state<CustomEvent<{ acceptedFiles: File[] }>>();

    let originalLevelpackValidated = $derived(validate(originalLevelpackFileData));
    let orginialLevelpackDifficulties = $state(createDifficultyArray());

    let updatedFile = $derived(eventStore?.detail?.acceptedFiles[0]);
    let updatedLevelpackData = $derived.by(async () => {
        if (!updatedFile) return;
        return await updatedFile.text();
    });
    let updatedLevelpackValidated = $derived.by(async () => {
        let x = await updatedLevelpackData;
        if (!x) return { valid: false };
        return validate(x);
    });
    let updatedLevelpackDifficulties = $state(orginialLevelpackDifficulties);
</script>

<svelte:head>
    <title>{title} - 5beam</title>
    <meta property="og:title" content={title + " by " + creatorName} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={Box} />
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
    <section class="flex text-xl">
        <span class="text-xl"><UserComponent prefix="by" {creator} /></span>
        <span class="px-1">::</span>
        <span class="pr-1 font-black text-purple-500">{levels.length}</span>
        <span class="text-purple-500">Spooky Levels</span>
        <span class="px-1">::</span>
        <span class="pr-1 font-black text-red-500">{plays}</span>
        <span class="text-red-500">treats collected</span>
        <span class="px-1">::</span>
        <span class="font-black text-amber-500">{formatDate_Day(created)}</span>
    </section>
</section>
<div class="flex justify-center gap-5 py-6">
    <Carousel {levels} showIndex autoPlay />
    <div class="flex w-1/5 flex-col justify-center gap-5 text-3xl font-bold">
        <BigButton
            text="Play"
            bg="#ffff5d"
            href="https://coppersalts.github.io/HTML5b?levelpack={id}"
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
        <BigButton
            text="Download"
            bg="#4bffff"
            onclick={downloadLevelpack}
            event="download-level"
        />
        <BigButton
            text={reportSending ? "Reported" : "Report"}
            bg="#ff5555"
            onclick={() => (reportMode = !reportMode)}
            disabled={reportSending}
        />
    </div>
</div>

<p class="pt-5 pl-2.5 text-4xl font-bold text-neutral-300">Description</p>
<p class="m-2 rounded-lg bg-neutral-800/90 p-3 text-2xl whitespace-pre-wrap backdrop-blur-sm">
    {levelpack.description}
</p>
<p class="pt-5 pl-2.5 text-4xl font-bold text-neutral-300">Levels included</p>
<div class="flex flex-wrap justify-center gap-4 pt-5">
    {#each levels as level}
        <LevelComponent data={level} />
    {/each}
</div>

<ReportDialog bind:open={reportMode} bind:reportSending kind="levelpack" />

<Dialog bind:open={editMode}>
    <div class="relative flex gap-5 overflow-hidden rounded-lg p-5 text-xl">
        <!-- TODO: Make this a form? -->
        <div class="flex flex-col gap-3">
            <div class="flex text-5xl">
                <FiveBStyle text="Edit Levelpack" />
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
            <div class="flex justify-end gap-2 *:grow">
                {#await updatedLevelpackValidated}
                    <Button text="Loading..." bg="#a8ff00" disabled />
                {:then data}
                    {#if data.valid || !updatedFile}
                        <Button
                            text={editSending ? "Saving..." : "Save"}
                            bg="#a8ff00"
                            onclick={saveLevelpack}
                            event="update-level"
                            disabled={editSending}
                        />
                    {:else}
                        <Button text="File not valid!" bg="#a8ff00" disabled />
                    {/if}
                {:catch}
                    {#if updatedFile}
                        <Button text="Unable to validate file..." bg="#a8ff00" disabled />
                    {:else}
                        <Button
                            text="Save"
                            bg="#a8ff00"
                            onclick={saveLevelpack}
                            event="update-level"
                        />
                    {/if}
                {/await}
                <Button text="Cancel" bg="#cccccc" onclick={() => (editMode = false)} />
            </div>
        </div>
        <div class="flex flex-col items-center gap-3">
            <!-- <p class="text-2xl font-bold">Update Level</p> -->
            <Dropzone
                accept="text/plain"
                multiple={false}
                maxSize={1000000}
                required={true}
                disableDefaultStyles={true}
                containerClasses="h-full w-full flex flex-col items-center rounded-sm outline-2 outline-dashed outline-white cursor-pointer"
                on:drop={(e) => (eventStore = e)}
            >
                {#if updatedFile}
                    <p class="m-auto text-center text-2xl">
                        {updatedFile.name} ({updatedFile.size / 1000}KB)
                    </p>
                {:else}
                    <div class="text-x m-auto p-4">
                        <p class="">Drag and drop your file here, or click to select a file!</p>
                        <p class="text-center text-sm">
                            Levelpacks with more than 200 levels will not be accepted
                        </p>
                    </div>
                {/if}
            </Dropzone>
            <div class="grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto">
                <p class="text-center">Original</p>
                <p class="text-center">Updated</p>
                <div class="items-start">
                    <Validator
                        result={originalLevelpackValidated}
                        bind:difficulties={orginialLevelpackDifficulties}
                    />
                </div>
                {#if updatedFile}
                    {#await updatedLevelpackValidated}
                        <div class="m-auto text-sm"><p>Loading...</p></div>
                    {:then result}
                        <Validator {result} bind:difficulties={updatedLevelpackDifficulties} />
                    {/await}
                {/if}
            </div>
        </div>
    </div>
</Dialog>
