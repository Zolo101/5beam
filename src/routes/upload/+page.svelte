<script lang="ts">
    import languageEncoding from "detect-file-encoding-and-language";
    import { derived, writable } from "svelte/store";
    import { fly } from "svelte/transition";
    import { postCreateLevelClient, postCreateLevelpackClient } from "../../client/ClientSideAPI";
    import Validator from "../../components/Validator.svelte";
    import { validateFile, type ValidateResult } from "../../client/FileValidator";
    import type { PageData } from "./$types";
    import type { Level, Levelpack } from "$lib/types";
    import { readBlobInANSI } from "../../misc";
    import Dropzone from "svelte-file-dropzone";

    export let data: PageData;
    let user = data.user;

    const loggedIn = !!user;
    let page = 1;
    const result = writable<ValidateResult | undefined>()
    const valid = derived(result, r => r?.valid)
    let eventStore = writable<Event>();
    // TODO: Allow multiple files?
    let file = derived(eventStore, e => (e as CustomEvent<{acceptedFiles: File[]}>)?.detail?.acceptedFiles[0])
    let title = writable("");
    let description = writable("");
    let modded = writable("");

    valid.subscribe(v => {
        if (v && page === 1) page = 2
    })

    modded.subscribe(m => {
        if (m && page === 1) page = 2
        if ((!m && !$valid) && page >= 2) page = 1
    })

    async function onSubmit(event: any) {
        if ($result === undefined) return;

        if ($valid || $modded) {
            // 5b levels can either be ANSI (flash) or UTF-8 (HTML5), so we need to support both.
            // We need to support ANSI to preserve the wood blocks (€) in flash levels.
            let encoding = (await languageEncoding($file!)).encoding;
            let isANSI = encoding === "CP1252"

            let text = isANSI ? await readBlobInANSI($file!) : await $file!.text()

            const payload = {
                access_token: data.access_token,
                title: $title,
                description: $description,
                modded: $modded,
                file: text
            }

            page = 4
            const type = $result.levels.length === 1
            const typeName = type ? "level" : "levelpack"
            const func = type ? postCreateLevelClient : postCreateLevelpackClient
            func(payload)
                .then((res: Level | Levelpack) => {
                    window.location.href = `/${typeName}/${res.id}`
                })
                .catch((err: unknown) => {
                    console.error(err)
                    alert("Unfortunately your upload has failed. Please contact @zelo101 on discord with your level(s).")
                })
        }
    }

    // function onFileUpload(event: any) {
    //     page = "description"
    // }

    function onTitleChange(event: any) {
        page = ($title.length > 0 && ($valid || $modded)) ? 3 : 2
    }

    file.subscribe((f) => validateFile(result, f))
</script>

<!-- "Changes may not be saved" -->
<svelte:window on:beforeunload={() => true}/>

{#if loggedIn}
    <!--TODO: Add close (X) button at top right -->
    <aside transition:fly={{y: -200}} class="max-w-[700px] backdrop-blur-lg bg-blue-400/20 rounded p-2 mx-auto mb-2">
        <!--                    <p class="text-7xl text-blue-500 top-[85px] absolute -z-10 text-opacity-50 italic font-extrabold">?</p>-->
        <p class="text-2xl font-bold text-blue-300">Did you know?</p>
        <p class="text-lg text-center text-blue-100">You can directly create and upload levels & levelpacks in HTML5b!</p>
    </aside>
    <section class="flex items-start max-w-[1400px] m-auto gap-2">
        <div class="w-1/2 text-neutral-100 bg-neutral-900 bg-opacity-40 p-4 rounded-lg shadow-lg">
            {#if page >= 1 && page !== 4}
                <div transition:fly={{x: -200}}>
                    <p class="text-6xl text-neutral-500/50 text-right relative w-full h-0 right-[10px] -z-10 italic font-extrabold">1</p>
                    <p class="text-xl text-center">Upload your level / levelpack!</p>
                    <p class="text-sm text-center mb-10">Levelpacks with more than 200 levels will not be accepted</p>
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
<!--                        <input on:change={(e) => $eventStore = e} type="file" name="file" class="rounded m-auto" accept="text/plain" required>-->
                        <p class="text-neutral-50 pt-6">Is this for a 5b mod?</p>
                        {#if $modded}
                            <p class="text-sm text-neutral-50">Be aware, levels for 5b mods cannot be played on HTML5b, and do not show up by default on the homepage and searches</p>
                        {/if}
                        <select bind:value={$modded} name="modded" class="rounded p-2.5">
                            <option value={""}>No</option>
                            <option value={"5*"}>5*30</option>
                            <option value={"golden5"}>Golden5</option>
                        </select>
                    </div>
<!--                    <a class="text-xs float-right my-4" href="http://battlefordreamisland.com/5b/levels.txt" target="_blank">Click here to see an example of a level / levelpack</a>-->
                </div>
            {/if}
            {#if page >= 2 && page !== 4}
                <div transition:fly={{x: -200}} class="py-5">
                    <p class="text-6xl text-neutral-500 text-right relative w-full h-0 right-[10px] -z-10 text-opacity-50 italic font-extrabold">2</p>
                    <div class="flex flex-col gap-2 w-4/5 text-xl my-2 mx-auto">
                        <p class="text-neutral-50">Title:</p>
                        <input bind:value={$title} on:input={onTitleChange} class="p-2.5 rounded" type="text" name="title" maxlength="64" placeholder="My 5b level (max 64 chars)" required>
                        <br>
                        <p class="text-neutral-50">Description:</p>
                        <textarea bind:value={$description} class="p-2.5 rounded" name="description" rows="5" cols="33" maxlength="1024" placeholder="Level description (max 1024 chars)" required></textarea>
                    </div>
                </div>
            {/if}
            {#if page >= 3 && page !== 4}
                <div transition:fly={{x: -200}}>
                    <p class="text-6xl text-neutral-500 text-right relative w-full h-0 right-[10px] -z-10 text-opacity-50 italic font-extrabold">3</p>
                    <form class="flex flex-col m-auto w-2/5" on:submit|preventDefault={onSubmit}>
                        <input type="submit" value="Upload!" class="text-xl text-green-800 bg-green-400 rounded p-2 cursor-pointer disabled:bg-green-500 disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                    </form>
                </div>
            {/if}
            {#if page === 4}
                <div transition:fly={{x: -200}}>
                    <p class="text-6xl text-neutral-500 text-right relative w-full h-0 right-[10px] -z-10 text-opacity-50 italic font-extrabold">:)</p>
                    <p class="text-2xl">Thank you for uploading to 5beam!</p>
                    <p class="w-4/5">You'll be redirected to your level after we generate the thumbnails. This should take at most 10 seconds.</p>
                </div>
            {/if}
        </div>
        {#if page !== 4}
            <div transition:fly={{x: -200}} class="w-1/2 bg-neutral-500/25 rounded p-5">
                {#if $modded}
                    <p class="text-center">Levels for mods cannot be automatically validated yet. For now, check that your level file works in the 5b mod before uploading!</p>
                {:else if $result}
                    <p class="text-center pb-5">Click on a level for more details!</p>
                    <Validator result={$result}/>
                {:else}
                    <p class="text-center opacity-70 animate-pulse">Awaiting file...</p>
                {/if}
            </div>
        {/if}
    </section>
{:else}
    <h1 class="text-6xl text-center font-extrabold">only users can upload levels 😡</h1>
{/if}