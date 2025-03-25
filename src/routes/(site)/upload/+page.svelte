<script lang="ts">
    import languageEncoding from "detect-file-encoding-and-language";
    import { derived, writable } from "svelte/store";
    import { fly } from "svelte/transition";
    import {
        postCreateLevelClient,
        postCreateLevelpackClient
    } from "../../../client/ClientSideAPI";
    import Validator from "../../../components/Validator.svelte";
    import { validateFile, type ValidateResult } from "../../../client/FileValidator";
    import type { PageData } from "../../../../.svelte-kit/types/src/routes";
    import type { Level, Levelpack } from "$lib/types";
    import { readBlobInANSI } from "../../../misc";
    import Dropzone from "svelte-file-dropzone";

    export let data: PageData;
    let user = data.user;

    const loggedIn = !!user;
    let page = 1;
    const result = writable<ValidateResult | undefined>();
    const valid = derived(result, (r) => r?.valid);
    let eventStore = writable<Event>();
    // TODO: Allow multiple files?
    let file = derived(
        eventStore,
        (e) => (e as CustomEvent<{ acceptedFiles: File[] }>)?.detail?.acceptedFiles[0]
    );
    let title = writable("");
    let description = writable("");
    let modded = writable("");

    valid.subscribe((v) => {
        if (v && page === 1) page = 2;
    });

    modded.subscribe((m) => {
        if (m && page === 1) page = 2;
        if (!m && !$valid && page >= 2) page = 1;
    });

    async function onSubmit(event: any) {
        if ($result === undefined) return;

        if ($valid || $modded) {
            // 5b levels can either be ANSI (flash) or UTF-8 (HTML5), so we need to support both.
            // We need to support ANSI to preserve the wood blocks (€) in flash levels.
            let encoding = (await languageEncoding($file!)).encoding;
            let isANSI = encoding === "CP1252";

            let text = isANSI ? await readBlobInANSI($file!) : await $file!.text();

            const payload = {
                access_token: data.access_token,
                title: $title,
                description: $description,
                modded: $modded,
                file: text
            };

            page = 4;
            const type = $result.levels.length === 1;
            const typeName = type ? "level" : "levelpack";
            const func = type ? postCreateLevelClient : postCreateLevelpackClient;

            // @ts-ignore
            window.umami.track("upload-level");

            func(payload)
                .then((res: Level | Levelpack) => {
                    window.location.href = `/${typeName}/${res.id}`;
                })
                .catch((err: unknown) => {
                    console.error(err);

                    // @ts-ignore
                    window.umami.track("upload-level-failed");

                    alert(
                        "Unfortunately your upload has failed. Please contact @zelo101 on discord with your level(s)."
                    );
                });
        }
    }

    // function onFileUpload(event: any) {
    //     page = "description"
    // }

    function onTitleChange(event: any) {
        page = $title.length > 0 && ($valid || $modded) ? 3 : 2;
    }

    file.subscribe((f) => validateFile(result, f));
</script>

<!-- "Changes may not be saved" -->
<svelte:window on:beforeunload={() => true} />

<!--TODO: Add close (X) button at top right -->
{#if !loggedIn}
    <aside
        transition:fly={{ y: -200 }}
        class="mx-auto mb-2 max-w-[800px] rounded-sm bg-amber-400/20 p-2 backdrop-blur-lg"
    >
        <!--                    <p class="text-7xl text-blue-500 top-[85px] absolute -z-10 text-opacity-50 italic font-extrabold">?</p>-->
        <p class="text-2xl font-bold text-amber-300">Warning</p>
        <p class="text-center text-lg text-amber-100">
            You are uploading as a guest. You will not be able to edit or delete your level after!
        </p>
    </aside>
{/if}
<!-- <aside
    transition:fly={{ y: -200 }}
    class="mx-auto mb-2 max-w-[700px] rounded-sm bg-blue-400/20 p-2 backdrop-blur-lg"
>
    <p class="text-2xl font-bold text-blue-300">Did you know?</p>
    <p class="text-center text-lg text-blue-100">
        You can directly create and upload levels & levelpacks in HTML5b!
    </p>
</aside> -->
<section class="m-auto flex max-w-[1400px] items-start gap-2">
    <div class="w-1/2 rounded-lg bg-neutral-900/40 p-4 text-neutral-100 shadow-lg">
        {#if page >= 1 && page !== 4}
            <div transition:fly={{ x: -200 }}>
                <div class="flex flex-col gap-2 text-xl">
                    <Dropzone
                        accept="text/plain"
                        multiple={false}
                        maxSize={1000000}
                        required={true}
                        disableDefaultStyles={true}
                        containerClasses="flex flex-col items-center bg-black/50 rounded-sm outline-2 outline-dashed outline-white/75 cursor-pointer py-2"
                        on:drop={(e) => ($eventStore = e)}
                    >
                        {#if $file}
                            <p>{$file.name} ({($file.size / 1000).toFixed(2)}KB)</p>
                        {:else}
                            <div class="py-25">
                                <p>Drag and drop your file here!</p>
                                <p>Or click here to select a file!</p>
                                <p class="text-sm">
                                    Levelpacks with more than 200 levels will not be accepted
                                </p>
                            </div>
                        {/if}
                    </Dropzone>
                    <!--                        <input on:change={(e) => $eventStore = e} type="file" name="file" class="rounded-sm m-auto" accept="text/plain" required>-->
                    <p class="pt-6 text-neutral-50">Is this for a 5b mod?</p>
                    {#if $modded}
                        <p class="text-sm text-neutral-50">
                            Be aware, levels for 5b mods cannot be played on HTML5b, and will only
                            show up in the "Mods" section of this site.
                        </p>
                    {/if}
                    <select bind:value={$modded} name="modded" class="rounded-sm bg-black/50 p-2.5">
                        <option value={""}>No</option>
                        <option value={"golden5"}>Golden 5</option>
                        <option value={"5*"}>5*30</option>
                    </select>
                </div>
                <!--                    <a class="text-xs float-right my-4" href="http://battlefordreamisland.com/5b/levels.txt" target="_blank">Click here to see an example of a level / levelpack</a>-->
            </div>
        {/if}
        {#if page >= 2 && page !== 4}
            <div transition:fly={{ x: -200 }} class="py-5">
                <div class="mx-auto my-2 flex w-4/5 flex-col gap-2 text-xl">
                    <p class="text-neutral-50">Title:</p>
                    <input
                        bind:value={$title}
                        on:input={onTitleChange}
                        class="rounded-sm bg-black/50 p-2.5"
                        type="text"
                        name="title"
                        maxlength="64"
                        placeholder="My 5b level (max 64 chars)"
                        required
                    />
                    <br />
                    <p class="text-neutral-50">Description:</p>
                    <textarea
                        bind:value={$description}
                        class="rounded-sm bg-black/50 p-2.5"
                        name="description"
                        rows="5"
                        cols="33"
                        maxlength="1024"
                        placeholder="Level description (max 1024 chars)"
                        required
                    ></textarea>
                </div>
            </div>
        {/if}
        {#if page >= 3 && page !== 4}
            <div transition:fly={{ x: -200 }}>
                <form class="m-auto flex w-2/5 flex-col" on:submit|preventDefault={onSubmit}>
                    <input
                        type="submit"
                        value="Upload!"
                        class="cursor-pointer rounded-sm bg-green-400 p-2 text-xl text-green-800 transition-colors disabled:cursor-not-allowed disabled:bg-green-500 disabled:opacity-25"
                    />
                </form>
            </div>
        {/if}
        {#if page === 4}
            <div transition:fly={{ x: -200 }}>
                <p class="text-2xl">Thank you for uploading to 5beam!</p>
                <p class="w-4/5">
                    You'll be redirected to your level after we generate the thumbnails. This should
                    take at most 10 seconds.
                </p>
            </div>
        {/if}
    </div>
    {#if page !== 4}
        <div transition:fly={{ x: -200 }} class="w-1/2 rounded-sm bg-neutral-500/25 p-2 font-bold">
            {#if $modded}
                <p class="p-5 text-center">
                    Levels for mods cannot be automatically validated yet. For now, check that your
                    level file works in the 5b mod before uploading!
                </p>
            {:else if $result}
                <p class="p-5 text-center">Click on a level for more details!</p>
                <Validator result={$result} />
            {:else}
                <p class="animate-pulse p-5 text-center">Waiting for levels...</p>
            {/if}
        </div>
    {/if}
</section>
