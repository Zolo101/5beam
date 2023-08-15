<script lang="ts">
    import { derived, writable } from "svelte/store";
    import { fly } from "svelte/transition";
    import { postCreateLevelClient, postCreateLevelpackClient } from "../../client/ClientSideAPI";
    import Validator from "../../components/Validator.svelte";
    import validate, { type ValidateResult } from "../../client/FileValidator";
    import type { PageData } from "./$types";
    import type { Level, Levelpack } from "$lib/types";
    import { readBlobInANSI } from "../../misc";

    export let data: PageData;
    let user = data.user;

    const loggedIn = !!user;
    let page = 1;
    const result = writable<ValidateResult | undefined>()
    const valid = derived(result, r => r?.valid)
    let eventStore = writable<Event>();
    // TODO: Allow multiple files?
    let file = derived(eventStore, e => (e?.target as HTMLInputElement)?.files?.[0])
    let title = writable("");
    let description = writable("");
    let modded: boolean = false;

    // goto stage 2 upon valid file upload
    valid.subscribe(v => {
        console.log(v)
        if (v && page === 1) page = 2
    })

    async function onSubmit(event: any) {
        if ($result === undefined) return;

        if ($valid) {
            // We need to read the file as ANSI to preserve the wood blocks (€)
            let text = await readBlobInANSI($file!)

            const payload = {
                // access_token: cookies.delete("access_token")
                title: $title,
                description: $description,
                modded: modded,
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
        page = $title.length > 0 ? 3 : 2
    }

    file.subscribe(validateFile)
    async function validateFile(f: File | undefined) {
        if (f) {
            console.log(f)
            if (f.size > 1_000_000) return alert("File too big! (1MB MAX)")
            if (f.type !== "text/plain") return alert("File must be a .txt file!")

            result.set(validate(await f.text()))
        }
    }
</script>

<!-- "Changes may not be saved" -->
<svelte:window on:beforeunload={() => true}/>

{#if loggedIn}
    <!--TODO: Add close (X) button at top right -->
    <div transition:fly={{y: -200}} class="max-w-[700px] bg-blue-400 bg-opacity-50 rounded p-2 mx-auto mb-2">
        <!--                    <p class="text-7xl text-blue-500 top-[85px] absolute -z-10 text-opacity-50 italic font-extrabold">?</p>-->
        <p class="text-2xl font-bold text-blue-300">Did you know?</p>
        <p class="text-lg text-center text-blue-100">You can directly create and upload levels & levelpacks in HTML5b!</p>
    </div>
    <div class="flex items-start max-w-[1400px] m-auto gap-2">
        <div class="w-1/2 text-neutral-100 bg-neutral-900 bg-opacity-40 p-4 rounded-lg shadow-lg">
            {#if page >= 1 && page !== 4}
                <div transition:fly={{x: -200}}>
                    <p class="text-6xl text-neutral-500 text-right relative w-full h-0 right-[10px] -z-10 text-opacity-50 italic font-extrabold">1</p>
                    <p class="text-xl text-center">Upload your level / levelpack!</p>
                    <p class="text-sm text-center mb-10">Levelpacks with more than 100 levels will not be accepted</p>
                        <div class="flex flex-col text-xl bg-neutral-100 bg-opacity-5 p-5">
                            <input on:change={(e) => $eventStore = e} type="file" name="file" class="rounded m-auto" accept="text/plain" required>
<!--                            <label>-->
<!--                                <span>Modded?</span>-->
<!--                                <input type="checkbox" name="modded" on:change={validateFile}>-->
<!--                            </label>-->
                        </div>
<!--                    <a class="text-xs float-right my-4" href="http://battlefordreamisland.com/5b/levels.txt" target="_blank">Click here to see an example of a level / levelpack</a>-->
                </div>
            {/if}
            {#if page >= 2 && page !== 4}
                <div transition:fly={{x: -200}} class="py-5">
                    <p class="text-6xl text-neutral-500 text-right relative w-full h-0 right-[10px] -z-10 text-opacity-50 italic font-extrabold">2</p>
                    <div class="flex flex-col gap-2 w-4/5 text-xl text-black my-2 mx-auto">
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
                        <input type="submit" value="Upload!" class="text-xl text-green-800 bg-green-400 rounded p-2 cursor-pointer disabled:bg-green-500 disabled:opacity-25 disabled:cursor-not-allowed transition-colors" disabled={!$valid}>
                    </form>
                </div>
            {/if}
            {#if page === 4}
                <div transition:fly={{x: -200}}>
                    <p class="text-6xl text-neutral-500 text-right relative w-full h-0 right-[10px] -z-10 text-opacity-50 italic font-extrabold">:)</p>
                    <p class="text-2xl">Thank you for uploading to 5beam!</p>
                    <p class="w-4/5">You will be redirected to the level in ~5 seconds while we generate the thumbnail.</p>
                </div>
            {/if}
        </div>
        {#if page !== 4}
            <div transition:fly={{x: -200}} class="w-1/2 bg-neutral-500 bg-opacity-25 rounded p-5">
                {#if $result}
                    <p class="text-center opacity-50">Check each level to make sure everything is correct!</p>
                    <Validator result={$result}/>
                {:else}
                    <p class="text-center opacity-50">Awaiting file...</p>
                {/if}
            </div>
        {/if}
    </div>
{:else}
    <h1 class="text-6xl text-center font-extrabold">only users can upload levels 😡</h1>
{/if}