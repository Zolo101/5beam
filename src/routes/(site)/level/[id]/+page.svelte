<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "$lib/components/UserComponent.svelte";
    import Button from "$lib/components/Button.svelte";
    import Difficulty from "$lib/components/Difficulty.svelte";
    import {
        clamp,
        formatDate_Day,
        getLevelThumbnailURL,
        getPlaysString,
        safeJsonLd,
        snap
    } from "$lib/misc";

    import LevelComponent from "$lib/components/browse/LevelComponent.svelte";
    import Dialog from "$lib/components/Dialog.svelte";
    import FiveBStyle from "$lib/components/FiveBStyle.svelte";
    import Dropzone from "svelte-file-dropzone";
    import { generateThumbnail, generateThumbnailFull } from "$lib/talk/create";
    import LevelInfo from "$lib/components/LevelInfo.svelte";
    import validate from "$lib/client/FileValidator";
    import BigButton from "$lib/components/BigButton.svelte";
    import { postModifyLevelClient } from "$lib/client/ClientSideAPI";
    import { editThumbnail } from "$lib/thumbnail.remote";
    import Featured from "$lib/assets/icons/Featured.svg?component";
    import Star from "$lib/components/Star.svelte";
    import Report from "$lib/components/Report.svelte";

    import Plays from "$lib/assets/icons/Plays.svg?component";
    import StarEnabled from "$lib/assets/icons/starEnabled.svg?component";

    interface Props {
        data: PageData;
    }

    let { data }: Props = $props();

    let { level, relatedLevels, user, starred } = $derived(data);
    let {
        id,
        title,
        description,
        thumbnail,
        difficulty,
        unlisted,
        plays,
        stars,
        featured,
        creator,
        modded,
        created,
        updated
    } = $derived(level);
    const creatorName = $derived(creator?.username ?? "Guest");
    let thumbnailUrl = $derived(getLevelThumbnailURL(id, thumbnail, false));
    let editMode = $state(false);
    let editSending = $derived(false);
    let showDifference = $state(false);

    // TODO: Can we put this thumbnail moving thing SOMEWHERE ELSE??
    // TODO: Only for 5beam, I need the thumbnail mover to show in HTML5b aswell
    let showThumbnailDialog = $state(false);
    let cropX = $state(0);
    let cropY = $state(0);
    let isDragging = $state(false);
    let dragStartX = $state(0);
    let dragStartY = $state(0);
    let initialCropX = $state(0);
    let initialCropY = $state(0);
    let fullThumbnailSize = $state({ width: 0, height: 0 });
    let displayedSize = $state({ width: 0, height: 0, offsetX: 0, offsetY: 0 });

    const CROP_WIDTH = 960;
    const CROP_HEIGHT = 540;

    // Scale factor between displayed and natural image size
    let scale = $derived(
        fullThumbnailSize.width > 0 ? displayedSize.width / fullThumbnailSize.width : 1
    );
    let scaledCropWidth = $derived(CROP_WIDTH * scale);
    let scaledCropHeight = $derived(CROP_HEIGHT * scale);

    function handleMouseDown(e: MouseEvent) {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        // Check if click is within the actual image area (accounting for object-contain)
        if (
            clickX >= displayedSize.offsetX &&
            clickX <= displayedSize.offsetX + displayedSize.width &&
            clickY >= displayedSize.offsetY &&
            clickY <= displayedSize.offsetY + displayedSize.height
        ) {
            // Convert click position to natural image coordinates
            const imageClickX = (clickX - displayedSize.offsetX) / scale;
            const imageClickY = (clickY - displayedSize.offsetY) / scale;

            // Center the crop rectangle at the click position
            const maxX = Math.max(0, fullThumbnailSize.width - CROP_WIDTH);
            const maxY = Math.max(0, fullThumbnailSize.height - CROP_HEIGHT);

            cropX = snap(clamp(imageClickX - CROP_WIDTH / 2, 0, maxX), 30);
            cropY = snap(clamp(imageClickY - CROP_HEIGHT / 2, 0, maxY), 30);
        }

        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initialCropX = cropX;
        initialCropY = cropY;

        // Attach global listeners for dragging outside the container
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    }

    function handleMouseMove(e: MouseEvent) {
        if (!isDragging) return;

        const deltaX = (e.clientX - dragStartX) / scale;
        const deltaY = (e.clientY - dragStartY) / scale;

        const maxX = Math.max(0, fullThumbnailSize.width - CROP_WIDTH);
        const maxY = Math.max(0, fullThumbnailSize.height - CROP_HEIGHT);

        cropX = snap(clamp(initialCropX + deltaX, 0, maxX), 30);
        cropY = snap(clamp(initialCropY + deltaY, 0, maxY), 30);
    }

    function handleMouseUp() {
        isDragging = false;

        // Remove global listeners
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
    }

    function handleImageLoad(e: Event) {
        const img = e.target as HTMLImageElement;
        fullThumbnailSize = { width: img.naturalWidth, height: img.naturalHeight };

        // Calculate displayed size accounting for object-contain
        const containerWidth = img.clientWidth;
        const containerHeight = img.clientHeight;
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const containerAspect = containerWidth / containerHeight;

        let displayWidth, displayHeight, offsetX, offsetY;
        if (imgAspect > containerAspect) {
            // Image is wider - fits width, letterboxed vertically
            displayWidth = containerWidth;
            displayHeight = containerWidth / imgAspect;
            offsetX = 0;
            offsetY = (containerHeight - displayHeight) / 2;
        } else {
            // Image is taller - fits height, pillarboxed horizontally
            displayHeight = containerHeight;
            displayWidth = containerHeight * imgAspect;
            offsetX = (containerWidth - displayWidth) / 2;
            offsetY = 0;
        }

        displayedSize = { width: displayWidth, height: displayHeight, offsetX, offsetY };

        // Center the crop initially
        cropX = Math.max(0, (img.naturalWidth - CROP_WIDTH) / 2);
        cropY = Math.max(0, (img.naturalHeight - CROP_HEIGHT) / 2);
    }

    $effect(() => {
        if (!editMode) editSending = false;
    });

    let isOwner = $derived(creator?.id === user?.record.id);

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

    async function editLevel() {
        editSending = true;

        const payload = {
            title: title,
            description: description,
            difficulty: [difficulty],
            modded: modded,
            file: await file?.text()
        };

        // @ts-ignore
        window.umami?.track("edit-level");

        postModifyLevelClient(payload, id)
            .then(() => (editMode = false))
            .catch((err) => {
                console.error(err);

                // @ts-ignore
                window.umami?.track("edit-level-failed");

                alert(
                    "Unfortunately your edit has failed. Please contact @zelo101 on discord with your level(s)."
                );
            });
    }

    async function editLevelThumbnail() {
        // @ts-ignore
        window.umami?.track("edit-level-thumbnail");

        try {
            // for the server
            const newThumbnailURL = await editThumbnail({
                id,
                data: level.data,
                x: cropX,
                y: cropY
            });

            // for the client
            thumbnailUrl = getLevelThumbnailURL(id, newThumbnailURL);
            showThumbnailDialog = false;
        } catch (err) {
            console.error(err);

            // @ts-ignore
            window.umami?.track("edit-level-thumbnail-failed");

            alert(
                "Unfortunately your thumbnail update has failed. Please contact @zelo101 on discord with your level(s)."
            );
        }
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

    const jsonLd = $derived(
        safeJsonLd({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            description: description,
            image: thumbnailUrl,
            author: { "@type": "Person", name: creatorName },
            dateCreated: created,
            dateModified: updated,
            interactionStatistic: {
                "@type": "InteractionCounter",
                interactionType: "https://schema.org/PlayAction",
                userInteractionCount: plays
            }
        })
    );
</script>

<svelte:head>
    <title>{title} - 5beam</title>
    <meta property="og:title" content={title + " by " + creatorName} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={thumbnailUrl} />
    <meta name="description" content={description} />
    <meta name="twitter:card" content="summary_large_image" />
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<section class="mt-2 flex flex-col max-xl:items-center xl:mx-48">
    <div class="flex items-baseline justify-between gap-2">
        <div class="flex items-baseline gap-3">
            {#if featured}
                <Featured width="56" height="56" />
            {/if}
            <span class="mb-1 text-6xl font-bold max-sm:text-center" class:featured>
                {title}
            </span>
            {#if user}
                <Star bind:stars bind:starred width="48" height="48" {id} type="0" />
            {/if}
        </div>
        <Report kind="level" />
    </div>
    <section class="flex items-baseline gap-10 text-xl font-bold">
        <span class="text-xl"><UserComponent prefix="by" {creator} /></span>
        <span>
            <Plays width="13" height="13" />
            <span class="text-green-500">
                {getPlaysString(plays)}
            </span>
        </span>
        <span>
            <StarEnabled width="15" height="15" />
            <span class="text-yellow-500">
                {getPlaysString(stars)}
            </span>
        </span>
        <span><Difficulty includeText {difficulty} /></span>
        <span>{formatDate_Day(created)}</span>
    </section>
</section>
<div class="flex justify-center gap-5 py-6 max-md:flex-col">
    <div class="relative">
        <img class="rounded-sm object-contain shadow-xl" src={thumbnailUrl} alt="Level thumbnail" />
        {#if isOwner || data.admin}
            <button
                onclick={() => (showThumbnailDialog = true)}
                class="absolute top-2 right-2 cursor-pointer rounded bg-neutral-800 px-4 py-1 text-neutral-100 drop-shadow-2xl transition-colors hover:bg-neutral-900"
            >
                Change thumbnail
            </button>
        {/if}
    </div>
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

{#if description}
    <p class="pl-2.5 text-4xl font-bold">Description</p>
    <p class="m-2 rounded-lg bg-neutral-800/90 p-3 text-2xl whitespace-pre-wrap backdrop-blur-sm">
        {description}
    </p>
{/if}

<p class="pl-2.5 text-4xl font-bold">Similar Levels</p>
<div class="flex flex-wrap justify-center gap-5 p-3">
    {#each relatedLevels as level}
        <LevelComponent data={level} />
    {/each}
</div>

<Dialog bind:open={showThumbnailDialog}>
    <div class="relative flex w-full flex-col items-center gap-5 rounded-lg p-5 text-xl">
        <div class="flex text-5xl">
            <FiveBStyle text="Change Thumbnail" />
        </div>
        <p class="text-sm text-neutral-400">Drag the selection box to choose the thumbnail area</p>
        {#await generateThumbnailFull(level.data)}
            <div class="m-auto flex h-[60vh] w-[50vw] items-center justify-center">
                <p>Loading full thumbnail...</p>
            </div>
        {:then fullThumbnail}
            {#await fullThumbnail.blob()}
                <div class="m-auto flex h-[60vh] w-[50vw] items-center justify-center">
                    <p>Loading full thumbnail...</p>
                </div>
            {:then fullThumbnailBlob}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="relative overflow-hidden select-none" onmousedown={handleMouseDown}>
                    <img
                        src={URL.createObjectURL(fullThumbnailBlob)}
                        alt="Full Level Thumbnail"
                        class="block max-h-[60vh] max-w-full object-contain"
                        onload={handleImageLoad}
                        draggable="false"
                    />
                    <!-- Darkened overlay (only over the image area) -->
                    <div
                        class="pointer-events-none absolute bg-black/60"
                        style="
                            left: {displayedSize.offsetX}px;
                            top: {displayedSize.offsetY}px;
                            width: {displayedSize.width}px;
                            height: {displayedSize.height}px;
                        "
                    ></div>
                    <!-- Selection rectangle (cutout) -->
                    <div
                        class="pointer-events-none absolute border-2 border-white shadow-lg"
                        style="
                            left: {displayedSize.offsetX + cropX * scale}px;
                            top: {displayedSize.offsetY + cropY * scale}px;
                            width: {scaledCropWidth}px;
                            height: {scaledCropHeight}px;
                            background: url({URL.createObjectURL(fullThumbnailBlob)});
                            background-size: {displayedSize.width}px {displayedSize.height}px;
                            background-position: -{cropX * scale}px -{cropY * scale}px;
                            cursor: move;
                        "
                    ></div>
                </div>
                <p class="text-sm text-neutral-400">
                    Selection: ({Math.round(cropX / 30)}, {Math.round(cropY / 30)})
                </p>
            {/await}
        {:catch error}
            <div class="m-auto text-sm">Unable to load full thumbnail...</div>
        {/await}

        <div class="flex justify-end gap-2">
            <Button text="Save" bg="#a8ff00" onclick={editLevelThumbnail} />
            <Button text="Close" bg="#cccccc" onclick={() => (showThumbnailDialog = false)} />
        </div>
    </div>
</Dialog>

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
            <!-- TODO: Inline this (somehow) -->
            <!-- <label for="unlisted" class="text-2xl font-bold">Unlisted</label>
            <input
                name="unlisted"
                type="checkbox"
                bind:checked={unlisted}
                class="h-6 w-6 rounded border-neutral-600 bg-neutral-800 accent-neutral-500"
            /> -->
            <div class="flex justify-end gap-2 *:grow">
                <!-- <button onclick={deleteLevel} class="float-left text-xs opacity-50">Delete</button> -->
                <Button
                    text={editSending ? "Saving..." : "Save"}
                    bg="#a8ff00"
                    onclick={editLevel}
                    event="update-level"
                    disabled={editSending}
                />
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
            <LevelInfo level={validate(level.data).levels[0]} />
            {#await levelDataJSON}
                <div class="m-auto text-sm"><p>Loading...</p></div>
            {:then dataJSON}
                <LevelInfo level={dataJSON} />
            {/await}
        </div>
        <div class="flex justify-center p-5 text-xl">
            <Button text="Close" bg="#a8ff00" onclick={() => (showDifference = false)} />
        </div>
    </Dialog>
</Dialog>
