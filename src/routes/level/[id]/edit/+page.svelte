<script lang="ts">
    import type { PageData } from "./$types";
    import UserComponent from "../../../../components/UserComponent.svelte";
    import { getLevelThumbnailURL, readBlobInANSI } from "../../../../misc";
    import { derived, writable } from "svelte/store";
    import Validator from "../../../../components/Validator.svelte";
    import languageEncoding from "detect-file-encoding-and-language";
    import { validateFile, type ValidateResult } from "../../../../client/FileValidator";
    import Difficulty from "../../../../components/Difficulty.svelte";
    import { postModifyLevelClient } from "../../../../client/ClientSideAPI";
    import type { Level } from "$lib/types";
    import { fly } from "svelte/transition";
    import Dropzone from "svelte-file-dropzone";

    export let data: PageData;

    const result = writable<ValidateResult | undefined>()
    const valid = derived(result, r => r?.valid && r.levels.length === 1)
    let level = data.level;
    let user = data.level.creator;
    let clientUser = data.user;
    let page = 1;

    let hasAccess = (user.discordId === clientUser?.id) || data.admin

    let eventStore = writable<Event>();
    let file = derived(eventStore, e => (e as CustomEvent<{acceptedFiles: File[]}>)?.detail?.acceptedFiles[0])

    let title = writable<string>(data.level.title);
    let description = writable<string>(data.level.description);
    let difficulty = writable<number>(data.level.difficulty);
    let modded = writable<string>(data.level.modded);

    // For letting the user edit the title and description
    let fileUnchanged = writable(true);
    let changed = derived([title, description, difficulty, modded, fileUnchanged], ([t, d, df, m, f]) => {
        return t !== data.level.title    ||
            d !== data.level.description ||
            df !== data.level.difficulty ||
            m !== data.level.modded      ||
            f === false
    })

    file.subscribe((f) => {
        validateFile(result, f)
        if (f !== undefined) fileUnchanged.set(false)
    })

    // TODO: Create a fake file with the current level data and set it to the variable "file".
    // We'll need to do this for the levelpack editing as well.

    const thumbnailUrl = getLevelThumbnailURL(level.id, level.thumbnail)

    async function onSubmit() {
        // Ignore if a file hasn't been uploaded
        // if ($fileUnchanged) return;
        // Allow if there's been no upload, or if the file is modded
        if (($valid || $fileUnchanged) || $modded) {
            const payload = {
                access_token: data.access_token,
                title: $title,
                description: $description,
                difficulty: $difficulty,
                modded: $modded,
                file: undefined as any
            }

            if (!$fileUnchanged) {
                // 5b levels can either be ANSI (flash) or UTF-8 (HTML5), so we need to support both.
                // We need to support ANSI to preserve the wood blocks (€) in flash levels.
                let encoding = (await languageEncoding($file!)).encoding;
                let isANSI = encoding === "CP1252"

                let text = isANSI ? await readBlobInANSI($file!) : await $file!.text()
                payload.file = text;
            }

            // for now, we're only supporting level editing
            // const type = $result.levels.length === 1
            // const typeName = type ? "level" : "levelpack"
            const typeName = "level"
            // const func = type ? postModifyLevelClient : postModifyLevelpackClient
            page = 2;
            const func = postModifyLevelClient
            func(payload, data.level.id)
                // .then((res: Level | Levelpack) => {
                .then((res: Level) => {
                    window.location.href = `/${typeName}/${res.id}`
                })
                .catch((err: unknown) => {
                    console.error(err)
                    alert("Unfortunately your edit has failed. Please contact @zelo101 on discord with your level(s).")
                })
        }
    }

    // "Changes may not be saved"
    window.onbeforeunload = () => ($changed && page === 1) ? "" : null
</script>

<!-- "Changes may not be saved" -->
<!--<svelte:window on:beforeunload={() => ""}/>-->

{#if hasAccess}
    <div class="bg-black/20 backdrop-blur-md rounded py-3">
        <div class="flex justify-center w-full">
            <!--    <img class="rounded-2xl" src="https://via.placeholder.com/720x405" alt="Placeholder Thumbnail"/>-->
            <img class="shadow-xl rounded w-[360px] h-[203px]" width="960" height="540" src={thumbnailUrl} alt="Placeholder Thumbnail"/>
            <!--    <div class="bg-neutral-300 w-[480px] h-[270px]"></div>-->
            <!--    <div class="bg-neutral-300 w-[720px] h-[405px]"></div>-->

            <!--<div class="w-[952px] h-[924px] relative bg-white bg-opacity-20 flex-col justify-start items-start inline-flex">-->
            <!--    <div class="justify-center items-center gap-3 inline-flex">-->
            <!--        <div class="w-[45px] h-[0px] relative origin-top-left rotate-180"></div>-->
            <!--        <div class="w-[66px] h-[46px] bg-gradient-to-b from-white to-neutral-600 rounded-[10px] justify-center items-center flex">-->
            <!--            <div class="w-[66px] h-[46px] text-center text-neutral-500 text-[32px] font-bold">0</div>-->
            <!--        </div>-->
            <!--        <div class="w-[45px] h-[0px] relative"></div>-->
            <!--    </div>-->
            <div class="flex my-10 flex-col justify-center items-center gap-2.5">
                <!--        <div class="w-[707px] h-[69px]"><span class="text-white text-[64px] font-black">Lo</span><span class="text-white text-[64px]">rem Ipsum</span></div>-->
<!--                <div class="m-auto">-->
                    <p class="text-center w-[350px] text-white text-5xl mx-4">{level.title}</p>
                    <p class="text-white text-2xl mx-4"><UserComponent prefix="by" {user}/></p>
<!--                </div>-->
            </div>
            <!--</div>-->
        </div>

        {#if page === 1}
        <div transition:fly={{y: -200}} class="flex pt-5">
            <div class="flex flex-col gap-2 w-1/2 text-xl text-neutral-100 mx-4 my-2">
                <p>Title:</p>
                <input bind:value={$title} class="p-2.5 rounded" type="text" name="title" maxlength="64" placeholder="My 5b level (max 64 chars)" required>
                <br>
                <p>Description:</p>
                <textarea bind:value={$description} class="p-2.5 rounded" name="description" rows="5" cols="33" maxlength="1024" placeholder="Level description (max 1024 chars)" required></textarea>
                <p>Difficulty:</p>
                <div class="flex flex-col text-2xl font-bold justify-items-center items-center align-middle">
                    <input
                            bind:value={$difficulty}
                            type="range"
                            name="difficulty"
                            min="0" step="1" max="7"
                            class="w-full"
                    />
                    {#key $difficulty}<Difficulty difficulty={$difficulty} includeText/>{/key}
                </div>
                {#if $difficulty === 7}
                    <p class="text-sm text-yellow-400">Warning: The "Impossible" difficulty is only for levels which are, without a doubt, impossible to complete. In the future, these levels may be put on a separate page.</p>
                {/if}
                <p class="pt-6">Is this for a 5b mod?</p>
                {#if $modded}
                    <p class="text-sm">Be aware, levels for 5b mods cannot be played on HTML5b, and do not show up by default on the homepage and searches</p>
                {/if}
                <select bind:value={$modded} name="modded" class="rounded p-2.5">
                    <option value={""}>No</option>
                    <option value={"5*"}>5*30</option>
                    <option value={"golden5"}>Golden5</option>
                </select>
            </div>
<!--            TODO: w-1/2 is temporary, it helps but doesnt fix the "goes outside of the div" problem -->
            <div class="w-1/2 mx-4 my-2">
<!--                <p class="text-sm text-center">For now, the difficulty of a level will be reset whenever a level is updated.</p>-->
                <p class="text-xl text-center">If you want you can also edit the level data for small changes, but make sure it only contains 1 level!</p>
                <div class="flex flex-col text-xl bg-neutral-100 bg-opacity-5 p-5 gap-2">
                    <Dropzone
                            accept="text/plain"
                            multiple={false}
                            maxSize={1000000}
                            required={true}
                            disableDefaultStyles={true}
                            containerClasses="flex flex-col items-center bg-black/50 rounded outline outline-1 outline-dashed outline-white/25 p-5"

                            on:drop={(e) => $eventStore = e}
                    >
                        {#if $file}
                            <p>{$file.name} ({($file.size / 1000).toFixed(2)}KB)</p>
                        {:else}
                            <p>Drag and drop your file here!</p>
                            <p>Or click here to select a file!</p>
                        {/if}
                    </Dropzone>
                </div>
                <div class="pt-5">
                    <Validator result={$result}/>
                </div>

                {#if ($valid || $fileUnchanged) && $changed}
                    <form class="flex flex-col w-full pt-5" on:submit|preventDefault={onSubmit} transition:fly={{y: 200}}>
                        <input type="submit" value="Edit!" class="text-xl text-green-800 bg-green-400 rounded p-2 cursor-pointer disabled:bg-green-500 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                    </form>
                {/if}
            </div>
        </div>
        {:else if page === 2}
            <div transition:fly={{y: -200}}>
                <p class="text-center text-4xl font-bold p-5 animate-pulse">Processing changes...</p>
            </div>
        {/if}
    </div>
{:else}
    <p>You need to be the owner to edit levels!</p>
{/if}